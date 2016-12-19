class Trail < ApplicationRecord
  has_many :nodes
  has_and_belongs_to_many :trips
end
