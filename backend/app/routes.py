from flask import Blueprint, request, jsonify
from .models import db, User, LoginAttempt
from .auth import authenticate_user
from .security import hash_password
from datetime import datetime
import pyotp  # Para generar los códigos TOTP
import qrcode  # Para generar el código QR
from io import BytesIO  # Para manejar los flujos de bytes de la imagen del QR
import base64
from datetime import timedelta
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from . import limiter
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


bp = Blueprint("routes", __name__)


@bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    failed_attempts = 0
    data = request.json
    user = authenticate_user(data["email"], data["password"])
    if user:

        totp = pyotp.TOTP(user.two_factor_secret)
        qr_url = totp.provisioning_uri(user.email, issuer_name="YourApp")

        # Generar el código QR
        qr_image = qrcode.make(qr_url)
        qr_image_io = BytesIO()
        qr_image.save(qr_image_io, format="PNG")
        qr_image_b64 = base64.b64encode(qr_image_io.getvalue()).decode("utf-8")

        return (
            jsonify(
                message="QR Code generated",
                qr_code=qr_image_b64,
                user_id=user.id,
            ),
            200,
        )

    return jsonify(error="Invalid credentials"), 401


@bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    user_id = data.get("user_id")
    otp_code = data.get("otp_code")

    # Verificar si los datos requeridos están presentes
    if not user_id or not otp_code:
        return jsonify(error="Missing required fields"), 400

    # Buscar al usuario en la base de datos
    user = User.query.get(user_id)
    if not user:
        return jsonify(error="User not found"), 404

    # Verificar el código OTP utilizando el secreto del usuario
    totp = pyotp.TOTP(user.two_factor_secret)
    if totp.verify(otp_code):  # Verifica si el código es válido
        access_token = create_access_token(
            identity=str(user.id),  # La identidad puede ser el ID del usuario
            additional_claims={
                "username": user.username,
                "email": user.email,
                "role_id": user.role_id,  # Agregar el rol al token
            },
            expires_delta=timedelta(hours=1),  # Configura la duración del token
        )

        return (
            jsonify(
                message="OTP verified",
                token=access_token,
                user={
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role_id": user.role_id,  # Incluir el rol en la respuesta
                },
            ),
            200,
        )

    return jsonify(error="Invalid or expired OTP"), 401


@bp.route("/register", methods=["POST"])
def register():
    data = request.json
    # Validación básica de entrada
    if not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify(error="Missing required fields"), 400

    # Verificar si el correo electrónico o el nombre de usuario ya existen
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify(error="Email already in use"), 400

    existing_username = User.query.filter_by(username=data["username"]).first()
    if existing_username:
        return jsonify(error="Username already taken"), 400

    totp = pyotp.TOTP(pyotp.random_base32())  # Generar un secreto aleatorio
    two_factor_secret = totp.secret

    # Crear y guardar el nuevo usuario
    password_hash = hash_password(data["password"])
    new_user = User(
        username=data["username"],
        email=data["email"],
        password_hash=password_hash,
        two_factor_secret=two_factor_secret,
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify(message="User created successfully"), 201


@bp.route("/users", methods=["GET"])
@jwt_required()  # Asegura que el usuario esté autenticado
def get_users():
    try:
        # Obtener la identidad del usuario autenticado (en este caso, el ID del usuario)
        current_user_id = get_jwt_identity()

        # Buscar el usuario actual en la base de datos
        current_user = User.query.get(current_user_id)

        # Verificar si el usuario tiene el rol de admin
        if current_user.role_id != 1:
            return (
                jsonify(error="Forbidden: You are not authorized to view all users"),
                403,
            )

        # Obtener todos los usuarios de la base de datos
        users = User.query.all()

        # Crear una lista con los datos de los usuarios
        user_list = [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role_id": user.role_id,
            }
            for user in users
        ]

        return jsonify(users=user_list), 200
    except Exception as e:
        return jsonify(error="Unauthorized: Invalid token or missing token"), 401
