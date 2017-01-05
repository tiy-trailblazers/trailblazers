class DistanceTooGreat < StandardError
  def initialize(msg="The components of this multilinestring are too far apart")
    super
  end
end
