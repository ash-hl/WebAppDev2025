class AppUser():
    
    def __init__(self,account_id,username,password,privilege):
        self.account_id = account_id
        self.username = username
        self.password = password
        self.privilege = privilege
    
    # I hate this
    def update_user(self,account_id,username,password,privilege):
        self.account_id = account_id
        self.username = username
        self.password = password
        self.privilege = privilege

    def is_logged_in(self):
        return not (self.account_id == -1)

    def log_out(self):
        self.account_id = -1
        self.username = ""
        self.password = ""
        self.privilege = -1
    
    def get_account_id(self):
        return self.account_id

    def get_username(self):
        return self.username

    def get_password(self):
        return self.password
    
    def get_privilege(self):
        return self.privilege

    def set_account_id(self, _account_id):
        self.account_id = _account_id
    
    def set_password(self, _password):
        self.password = _password
    
    def set_username(self, _username):
        self.username = _username
    
    def set_privilege(self, _privilege):
        self.privilege = _privilege