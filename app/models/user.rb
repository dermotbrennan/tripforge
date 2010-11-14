class User < ActiveRecord::Base
  has_many :credentials

  acts_as_authentic do |c|
    c.crypto_provider = Authlogic::CryptoProviders::BCrypt
  end

  def is_admin?
    login == 'admin' || is_superadmin?
  end

  def is_superadmin?
    login == 'superadmin'
  end

  def credential_for(provider)
    self.credentials.where(:provider_id => provider.id).first
  end

  def has_credential_for?(provider)
    !!credential_for(provider)
  end
end
