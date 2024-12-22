import random
import string
from .models import db, User, LoginAttempt
from .security import hash_password, check_password
from datetime import timedelta
from datetime import datetime


def generate_otp():
    return "".join(random.choices(string.digits, k=6))


def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()

    # Si el usuario no existe, registramos un intento fallido
    if not user:
        return None

    # Si el usuario existe pero la contraseña es incorrecta, también registramos un intento fallido
    if not check_password(user.password_hash, password):
        return None

    return user
