class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user

    if user.is_admin?
      can :manage, :all
    else
      can :read, Trip, :user_id => user.id
      can :show, Trip do |trip|
        trip && (trip.user == user || trip.is_public?)
      end

      can [:update, :destroy], Trip do |trip|
        trip && trip.user == user
      end
      can :create, Trip

      can :read, Event do |event|
        event && (event.trip.user == user || event.trip.is_public?)
      end

      can [:update, :destroy], Event do |event|
        event && event.trip.user == user
      end

      can :read, Item do |item|
        trip = item.event.trip
        item && (trip.user == user || trip.is_public?)
      end

      can [:update, :destroy], Item do |item|
        item && item.event.trip.user == user
      end
    end
  end
end