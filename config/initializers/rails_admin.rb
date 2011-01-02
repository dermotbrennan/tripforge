RailsAdmin.authenticate_with do
  unless current_user && current_user.is_admin?
    redirect_to :root, :flash => {:error => "Access Denied"}
  end
end