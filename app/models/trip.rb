class Trip < ApplicationRecord
  has_and_belongs_to_many :users
  has_and_belongs_to_many :trails
  has_and_belongs_to_many :campgrounds
  has_and_belongs_to_many :parks

  validates :start_date, presence: true

  def belongs_to?(user)
    user.trips.include?(self)
  end
end
