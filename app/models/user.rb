class User < ActiveRecord::Base
  has_many :authentications
  has_many :credentials

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me

  def apply_omniauth(omniauth)
    Rails.logger.debug(omniauth['user_info'].inspect)
    self.email = omniauth['user_info']['email'] if email.blank?
    self.first_name = omniauth['user_info']['first_name'] if first_name.blank?
    self.last_name = omniauth['user_info']['last_name'] if last_name.blank?
    provider = Provider.find_by_code(omniauth['provider'])
    authentications.build(:provider_id => provider.id, :uid => omniauth['uid'])
  end

  def password_required?
    (authentications.empty? || !password.blank?) && super
  end
  
  def is_admin?
    role == 'admin'
  end

  def credential_for(provider)
    self.credentials.where(:provider_id => provider.id).first
  end

  def has_credential_for?(provider)
    !!credential_for(provider)
  end
end
