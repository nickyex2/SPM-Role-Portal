import enum
from api import db

class statusEnum(enum.Enum):
    active = "active"
    inactive = "inactive"


class RoleListing(db.Model):
    __tablename__ = 'ROLE_LISTINGS'
    role_listing_id = db.Column(
        db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, nullable=False)
    role_listing_desc = db.Column(db.String(10000), nullable=False)
    role_listing_source = db.Column(db.Integer, nullable=False)
    role_listing_open = db.Column(db.Date, nullable=False)
    role_listing_close = db.Column(db.Date, nullable=False)
    role_listing_creator = db.Column(db.Integer, nullable=False)
    role_listing_ts_create = db.Column(
        db.TIMESTAMP, nullable=False, server_default=db.func.current_timestamp())
    role_listing_status = db.Column(db.Enum(statusEnum), nullable=False)
    role_listing_updater = db.Column(db.Integer, nullable=False)
    role_listing_ts_update = db.Column(
        db.TIMESTAMP, nullable=False, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __init__(self, role_listing_id, role_id, role_listing_desc, role_listing_source, role_listing_open, role_listing_close, role_listing_creator, role_listing_status, role_listing_updater):
        self.role_listing_id = role_listing_id
        self.role_id = role_id
        self.role_listing_desc = role_listing_desc
        self.role_listing_source = role_listing_source
        self.role_listing_open = role_listing_open
        self.role_listing_close = role_listing_close
        self.role_listing_creator = role_listing_creator
        self.role_listing_status = role_listing_status
        self.role_listing_updater = role_listing_updater

    def json(self):
        return {
            "role_listing_id": self.role_listing_id,
            "role_id": self.role_id,
            "role_listing_desc": self.role_listing_desc,
            "role_listing_source": self.role_listing_source,
            "role_listing_open": self.role_listing_open.isoformat(),
            "role_listing_close": self.role_listing_close.isoformat(),
            "role_listing_creator": self.role_listing_creator,
            "role_listing_ts_create": self.role_listing_ts_create.isoformat(),
            "role_listing_status": self.role_listing_status.name,
            "role_listing_updater": self.role_listing_updater,
            "role_listing_ts_update": self.role_listing_ts_update.isoformat()
        }

class RoleListingChanges(db.Model):
    __tablename__ = 'ROLE_LISTING_CHANGES'
    change_id = db.Column(db.Integer, primary_key=True)
    role_listing_id = db.Column(db.Integer, nullable=False, primary_key=True)
    change_no = db.Column(db.Integer, nullable=False, primary_key=True)
    log_time = db.Column(db.TIMESTAMP, nullable=False, server_default=db.func.current_timestamp())
    role_listing_updater = db.Column(db.Integer, nullable=False)
    changed_field = db.Column(db.String(255), nullable=False)
    old_value = db.Column(db.String(10000), nullable=False)
    new_value = db.Column(db.String(10000), nullable=False)

    def __init__(self, role_listing_id, change_no, role_listing_updater, changed_field, old_value, new_value):
        self.role_listing_id = role_listing_id
        self.change_no = change_no
        self.role_listing_updater = role_listing_updater
        self.changed_field = changed_field
        self.old_value = old_value
        self.new_value = new_value

    def json(self):
        return {
            "role_listing_id": self.role_listing_id,
            "change_no": self.change_no,
            "log_time": self.log_time.isoformat(),
            "role_listing_updater": self.role_listing_updater,
            "changed_field": self.changed_field,
            "old_value": self.old_value,
            "new_value": self.new_value
        }