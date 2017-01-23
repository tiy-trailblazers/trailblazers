class User < ApplicationRecord
  has_and_belongs_to_many :trips
  validates :email, uniqueness: true
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true
  mount_uploader :avatar, AvatarUploader

  has_secure_password

end
