from flask import Flask
from flask_cors import CORS
from config import Config
from models import db, User, Ticket, Report, TicketUpdate
from routes.tickets import tickets_bp
from routes.offices import offices_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)   # allow frontend to talk with backend

    db.init_app(app)

    app.register_blueprint(tickets_bp)
    app.register_blueprint(offices_bp)


    with app.app_context():
        db.create_all()

    @app.route("/ping")
    def ping():
        return "pong"
    
    print("Blueprints:", app.blueprints)
    return app


app = create_app()


if __name__ == "__main__":
    print("server start...")
    app.run(host="0.0.0.0", port=5000, debug=True)