# SIH
🔹 Tech Stack (Web Focused)

Frontend (UI) → React.js (with TailwindCSS / Material UI for quick design).

Backend (APIs) → Node.js + Express (simple REST APIs).

Database → Firebase (fast + easy auth & storage) or MongoDB Atlas.

Maps → Leaflet.js (free, open-source, works with OpenStreetMap).

AI Itinerary → Simple backend service (OpenAI API / rule-based mock).

Blockchain (if included) → Solidity smart contract on Polygon testnet (optional, can demo with screenshots if time runs short).

🔹 Web App Workflow
1. Landing Page / Home

Navbar: Home | Things to Do | Hotels | Transport | Planner | Wishlist | My Trips

Hero banner: “Discover Eco & Cultural Tourism in Jharkhand”

Cards for quick access to features.

2. Things to Do

Show hotspots (from POI.json).

Each card → Image, description, map pin, “Add to Wishlist”.

Sidebar → filter by Nature / Culture / Adventure / Shopping.

3. Transport

Tabs: Local Rides (Uber/Ola) | Trains | Flights | Car Rentals.

Data shown from JSON (dummy).

On “Book Now” → confirm modal, then save to “My Trips”.

4. Hotels

Grid of hotel cards with price/night, rating, description.

Dummy booking → “Added to Trip Plan”.

Option to view on map.

5. AI Trip Planner (Key Judge Feature 🚀)

Input form → Budget, Duration, Interests.

Backend generates itinerary (Day 1 / Day 2 / Day 3 plan).

Shows POIs, hotels, and transport suggestions.

Option: “Save this Trip”.

6. Food & Shopping

Food hotspots (JSON with restaurants + sample menus).

Tribal shopping: handicrafts, paintings, local art.

“Add to Wishlist” or “Add to Trip Plan”.

7. Cultural Experiences

Museums, folk shows, tribal art centers.

Can add to trip.

8. Wishlist

All items (POIs, hotels, shops, events) saved by user.

Option to move items from wishlist → trip plan.

9. My Trips

Trip summary with:

Duration

Budget used

Booked hotels/transport

Itinerary (AI-generated or manual)

Option: export as PDF.