# Clear existing data
puts "Checking into server... cleaning old data..."
Review.destroy_all
Booking.destroy_all
Room.destroy_all
User.destroy_all

# Create Admin
puts "Creating the Master Architect (Admin)..."
admin = User.create!(
  name: "Admin User",
  email: "admin@havenhotels.com",
  password: "password123",
  role: 1, # admin
  status: 0,
  verified: true
)

# Create Demo User
puts "Creating a Test Guest..."
user = User.create!(
  name: "Ahmad Muaaz",
  email: "john@example.com",
  password: "password123",
  role: 0, # user
  status: 0,
  verified: true
)

# Create Rooms
puts "Building Haven Hotels with 24 Premium Rooms..."

# Helper for creating rooms
def create_rooms(count, category, base_name, base_price, capacity, description)
  count.times do |i|
    Room.create!(
      name: base_name, # Removed the A, B, C suffix
      description: description,
      category: category,
      status: 0,
      capacity: capacity,
      price_per_night: base_price,
      is_featured: i < 2
    )
  end
end

# 6 Single Rooms (category: 0) - Price: 10000
create_rooms(6, 0, "Haven Solo", 10000, 1, "A cozy and elegant space designed for the modern solo traveler. Features a comfortable bed and 24/7 room service.")

# 6 Couple Rooms (category: 1) - Price: 15000
create_rooms(6, 1, "Haven Couple", 15000, 2, "A romantic sanctuary for two. Modern aesthetics combined with cozy interiors for an unforgettable stay.")

# 6 Family Rooms (category: 2) - Price: 20000
create_rooms(6, 2, "Haven Family", 20000, 4, "Spacious and comfortable, designed for families. Includes multiple beds and child-friendly amenities.")

# 6 Presidential Suites (category: 3) - Price: 40000
create_rooms(6, 3, "Haven Elite", 40000, 6, "Our premium suite offering ultimate luxury. Massive space, private access, and top-tier butler service.")

puts "✨ Haven Hotels Built with 24 Rooms! Run 'bundle exec rails db:seed' to apply changes."
