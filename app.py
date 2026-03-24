from flask import Flask, render_template, redirect, url_for, request, flash
from models import db, User, Notice, Assignment, Attendance
from flask_login import LoginManager, login_user, login_required, logout_user, current_user

app = Flask(__name__)
app.config['SECRET_KEY'] = 'campussecret2k26'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///campus.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# ─── LOGIN ───────────────────────────────────────────
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and user.password == request.form['password']:
            login_user(user)
            if user.role == 'student':
                return redirect(url_for('student_dashboard'))
            elif user.role == 'faculty':
                return redirect(url_for('faculty_dashboard'))
            elif user.role == 'admin':
                return redirect(url_for('admin_dashboard'))
        flash('Invalid username or password')
    return render_template('login.html')


# ─── LOGOUT ──────────────────────────────────────────
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


# ─── STUDENT ─────────────────────────────────────────
@app.route('/student')
@login_required
def student_dashboard():
    notices     = Notice.query.order_by(Notice.id.desc()).all()
    assignments = Assignment.query.order_by(Assignment.id.desc()).all()
    attendance  = Attendance.query.filter_by(student_id=current_user.id).all()
    return render_template(
        'student_dashboard.html',
        notices=notices,
        assignments=assignments,
        attendance=attendance
    )


# ─── FACULTY ─────────────────────────────────────────
@app.route('/faculty', methods=['GET', 'POST'])
@login_required
def faculty_dashboard():
    if request.method == 'POST':
        action = request.form.get('action')

        if action == 'notice':
            notice = Notice(
                title=request.form['title'],
                content=request.form['content']
            )
            db.session.add(notice)
            db.session.commit()
            flash('Notice posted successfully')

        elif action == 'assignment':
            assignment = Assignment(
                title=request.form['title'],
                description=request.form['description']
            )
            db.session.add(assignment)
            db.session.commit()
            flash('Assignment posted successfully')

        elif action == 'attendance':
            attendance = Attendance(
                student_id=request.form['student_id'],
                status=request.form['status']
            )
            db.session.add(attendance)
            db.session.commit()
            flash('Attendance marked successfully')

    students = User.query.filter_by(role='student').all()
    return render_template('faculty_dashboard.html', students=students)


# ─── ADMIN ───────────────────────────────────────────
@app.route('/admin')
@login_required
def admin_dashboard():
    users = User.query.all()
    return render_template('admin_dashboard.html', users=users)


# ─── INIT DB ─────────────────────────────────────────
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.first():
            db.session.add_all([
                User(username='student1', password='pass', role='student', name='Ravi Kumar'),
                User(username='student2', password='pass', role='student', name='Priya Singh'),
                User(username='faculty1', password='pass', role='faculty', name='Dr. Sharma'),
                User(username='admin1',   password='pass', role='admin',   name='Admin'),
            ])
            db.session.commit()
            print('Demo users created.')
    app.run(debug=True)