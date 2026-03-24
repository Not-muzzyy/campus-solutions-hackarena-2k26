from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class User(UserMixin, db.Model):
    __tablename__ = 'user'

    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role     = db.Column(db.String(20), nullable=False)  # student / faculty / admin
    name     = db.Column(db.String(100), nullable=False)

    attendance = db.relationship('Attendance', backref='student', lazy=True)


class Notice(db.Model):
    __tablename__ = 'notice'

    id      = db.Column(db.Integer, primary_key=True)
    title   = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)


class Assignment(db.Model):
    __tablename__ = 'assignment'

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)


class Attendance(db.Model):
    __tablename__ = 'attendance'

    id         = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status     = db.Column(db.String(10), nullable=False)  # Present / Absent