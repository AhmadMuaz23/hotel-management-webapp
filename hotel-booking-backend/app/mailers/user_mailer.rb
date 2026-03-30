class UserMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.account_verification.subject
  #
  def account_verification(user)
    @user = user
    @code = user.verification_code
    mail to: user.email, subject: "Verify your HavenHotels Account"
  end
end
