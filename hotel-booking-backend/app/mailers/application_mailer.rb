class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('SMTP_USERNAME', 'no-reply@havenhotels.com')
  layout "mailer"
end
