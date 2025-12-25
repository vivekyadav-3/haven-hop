# Haven Hop - Airbnb Clone

A full-stack web application inspired by Airbnb, built with Node.js, Express, MongoDB, and EJS. Users can browse listings, create accounts, add their own properties, leave reviews, and view locations on interactive maps.

## Features

- 🏠 **Browse Listings** - Explore various property listings with detailed information
- 🔍 **Search & Filter** - Search by destination and filter by categories (Trending, Rooms, Mountains, etc.)
- 👤 **User Authentication** - Secure signup/login with Passport.js
- ✏️ **CRUD Operations** - Create, read, update, and delete your own listings
- ⭐ **Reviews & Ratings** - Leave reviews and ratings for properties
- 🗺️ **Interactive Maps** - View property locations using Leaflet maps with OpenStreetMap
- 📱 **Responsive Design** - Mobile-friendly interface with Bootstrap 5

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **Template Engine**: EJS with EJS-Mate
- **Maps**: Leaflet.js with OpenStreetMap
- **Geocoding**: Node-Geocoder (OpenStreetMap provider)
- **Styling**: Bootstrap 5, Custom CSS
- **Session Management**: Express-Session with Connect-Flash

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vivekyadav-3/haven-hop.git
   cd haven-hop
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   MAPBOX_TOKEN=your_mapbox_token_here
   SESSION_SECRET=your_secret_key_here
   MONGO_URL=mongodb://127.0.0.1:27017/haven_hop
   ```

4. **Start MongoDB**

   Make sure MongoDB is running on your system:

   ```bash
   mongod
   ```

5. **Run the application**

   ```bash
   npm start
   ```

6. **Access the application**

   Open your browser and navigate to: `http://localhost:8080`

## Project Structure

```
airbnb/
├── models/           # Mongoose models (User, Listing, Review)
├── views/            # EJS templates
│   ├── includes/     # Reusable components (navbar, footer, flash)
│   ├── layouts/      # Layout templates
│   ├── listings/     # Listing-related views
│   └── users/        # User authentication views
├── public/           # Static assets
│   ├── css/          # Stylesheets
│   └── js/           # Client-side JavaScript
├── middleware.js     # Custom middleware functions
├── app.js            # Main application file
└── package.json      # Project dependencies
```

## Usage

### Creating an Account

1. Click "Sign up" in the navigation bar
2. Enter your email, username, and password
3. You'll be redirected to the listings page

### Adding a Listing

1. Log in to your account
2. Click "Airbnb your home" in the navbar
3. Fill in the listing details (title, description, price, location, etc.)
4. Submit the form

### Leaving a Review

1. Navigate to any listing's detail page
2. Scroll down to the "Leave a Review" section
3. Select a star rating and write your comments
4. Submit the review

## API Routes

- `GET /` - Home page
- `GET /listings` - View all listings
- `GET /listings/new` - Form to create new listing (requires login)
- `POST /listings` - Create new listing (requires login)
- `GET /listings/:id` - View single listing
- `GET /listings/:id/edit` - Edit listing form (requires ownership)
- `PUT /listings/:id` - Update listing (requires ownership)
- `DELETE /listings/:id` - Delete listing (requires ownership)
- `POST /listings/:id/reviews` - Add review (requires login)
- `DELETE /listings/:id/reviews/:reviewId` - Delete review (requires authorship)
- `GET /signup` - Signup form
- `POST /signup` - Register new user
- `GET /login` - Login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## Security Features

- Password hashing with Passport-Local-Mongoose
- Session-based authentication
- CSRF protection through method-override
- Authorization checks for edit/delete operations
- Flash messages for user feedback

## Future Enhancements

- Image upload functionality with Cloudinary
- Advanced search filters
- Booking system with calendar
- Payment integration
- Email notifications
- User profiles with avatars
- Wishlist/favorites feature

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Created with ❤️ by [Your Name]

## Acknowledgments

- Inspired by Airbnb
- Bootstrap for responsive design
- Leaflet.js for mapping functionality
- OpenStreetMap for free map tiles and geocoding
