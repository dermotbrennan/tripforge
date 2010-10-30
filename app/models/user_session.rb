class UserSession < Authlogic::Session::Base
  generalize_credentials_error_messages 'The login or password you entered is incorrect'

  # to enable database sessions:
  # rake db:sessions:create
  # rake db:migrate
  # change environment.rb: config.action_controller.session_store = :active_record_store
  def to_key
    new_record? ? nil : [ self.send(self.class.primary_key) ]
  end
end
