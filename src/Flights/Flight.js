import { useState, useEffect } from "react";
import { FaSearch, FaExchangeAlt, FaChevronDown } from "react-icons/fa";
import Lottie from "lottie-react";
import axios from "axios";

const Flight = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabinClass, setCabinClass] = useState("economy");
  const [adults, setAdults] = useState(1);
  const [sortBy, setSortBy] = useState("best");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animationData, setAnimationData] = useState(null);
  const [airplane, setAirplane] = useState(null);
  const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;

  useEffect(() => {
    fetch("/animation.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Lottie yükleme hatası:", error));
  }, []);

  useEffect(() => {
    fetch("/airplane.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Airplane data:", data);
        setAirplane(data);
      })
      .catch((error) => {
        console.error("There was an error loading the animation:", error);
      });
  }, []);

  const getAirportDetails = async (iataCode) => {
    try {
      const response = await axios.get(
        "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
        {
          params: { query: iataCode },
          headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
          },
        }
      );

      if (response.data && response.data.data.length > 0) {
        const airport = response.data.data[0];
        return {
          skyId: airport.skyId,
          entityId: airport.entityId,
        };
      }
      return null;
    } catch (error) {
      console.error("Error receiving airport information:", error);
      return null;
    }
  };

  const searchFlights = async () => {
    if (!departure || !destination || !departureDate) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    const origin = await getAirportDetails(departure);
    const destinationDetails = await getAirportDetails(destination);

    if (!origin || !destinationDetails) {
      setError("Invalid airport code. Please enter a correct code.");
      setLoading(false);
      return;
    }

    const options = {
      method: "GET",
      url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
      params: {
        originSkyId: origin.skyId,
        destinationSkyId: destinationDetails.skyId,
        originEntityId: origin.entityId,
        destinationEntityId: destinationDetails.entityId,
        date: departureDate,
        returnDate: returnDate || undefined,
        cabinClass: cabinClass,
        adults: adults,
        sortBy: sortBy,
        currency: "USD",
        market: "en-US",
        countryCode: "US",
      },
      headers: {
        "x-rapidapi-key": "5170209b86msh9c455ea869b4e68p13c3adjsne7e58f993a81",
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log("response", response.data);
      setFlights(response.data);
    } catch (error) {
      console.error("API Hatası:", error);
      setError("Uçuş bilgileri alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 flex flex-col items-center">
      <div className="relative w-full h-[300px] flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-600 overflow-hidden">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-screen h-[600px]"
          />
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>

      <div className="mt-[-50px] bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-4xl relative z-10">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="mt-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              <option value="best">Best</option>
              <option value="price_high">Cheapest</option>
              <option value="fastest">Fastest</option>
              <option value="outbound_take_off_time">
                Outbound take off time
              </option>
              <option value="outbound_landing_time ">
                Outbound Landing Time
              </option>
              <option value="return_take_off_time">Return Take Off Time</option>
              <option value="return_landing_time">Return Landing Time</option>
            </select>
          </div>

          <div className="mt-3">
            <input
              type="number"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              min="1"
              className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
              placeholder="Adults (e.g. 1)"
            />
          </div>
          <div className="mt-3">
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 border p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            placeholder="From (e.g. IST)"
            value={departure}
            onChange={(e) => setDeparture(e.target.value.toUpperCase())}
            className="w-full p-2 border-none bg-transparent outline-none"
          />
          <button className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300">
            <FaExchangeAlt />
          </button>
          <input
            type="text"
            placeholder="To (e.g. JFK)"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            className="w-full p-2 border-none bg-transparent outline-none"
          />
        </div>

        <div className="flex justify-between items-center mt-3 gap-2">
          <input
            type="date"
            className="w-1/2 p-2 border rounded-lg"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
          <input
            type="date"
            className="w-1/2 p-2 border rounded-lg"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>

        <div className="flex justify-center mt-5">
          <button
            onClick={searchFlights}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg text-lg hover:bg-blue-700"
          >
            <FaSearch />
            Search
          </button>
        </div>

        {loading && airplane && (
          <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-700 bg-opacity-90 z-50">
            <Lottie
              animationData={airplane}
              loop={true}
              style={{ width: 150, height: 150 }}
            />
          </div>
        )}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}

        {flights.data && flights.data.itineraries ? (
          flights.data.itineraries.map((flight, index) => {
            const leg = flight.legs[0];

            const price = flight.price?.formatted || "No price information";
            const originName =
              leg.origin?.name || "Missing airport information";
            const destinationName =
              leg.destination?.name || "Missing airport information";
            const stopText =
              leg.stopCount !== undefined
                ? `${leg.stopCount} stop`
                : "No stop information available";
            const durationText = leg.durationInMinutes
              ? `${Math.floor(leg.durationInMinutes / 60)} hour ${
                  leg.durationInMinutes % 60
                } minute`
              : "Duration information not available";

            const airline =
              leg.carriers?.marketing?.[0]?.name ||
              "No airline information available";
            const airlineLogo = leg.carriers?.marketing?.[0]?.logoUrl || "";

            return (
              <li
                key={index}
                className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
              >
                <div>
                  <p className="text-xl font-bold">
                    {new Date(leg.departure).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(leg.arrival).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-gray-600">
                    {originName} - {destinationName}
                  </p>
                  <p className="text-gray-500">{stopText}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{price} USD</p>
                  <p className="text-gray-500">{durationText}</p>
                </div>

                <div className="flex items-center gap-2">
                  {airlineLogo && (
                    <img
                      src={airlineLogo}
                      alt={airline}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <p className="text-sm text-gray-700 dark:text-white">
                    {airline}
                  </p>
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-center mt-4">No flight information found.</p>
        )}
      </div>
    </div>
  );
};

export default Flight;
