import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getEvents,
  deleteEvent,
  getEventStatus,
} from "../../store/slices/eventSlice";
import { toast } from "react-toastify";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TrophyIcon,
  MusicalNoteIcon,
  WrenchIcon,
  LightBulbIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  HeartIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

const EventCard = ({ event, onDelete, isAdmin }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const status = getEventStatus(event.startDate, event.endDate);

  const statusColors = {
    Upcoming: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Ongoing: "bg-blue-100 text-blue-800 border border-blue-200",
    Completed: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      Sports: "bg-amber-100 text-amber-800 border border-amber-200",
      Cultural: "bg-rose-100 text-rose-800 border border-rose-200",
      Technical: "bg-sky-100 text-sky-800 border border-sky-200",
      Workshop: "bg-purple-100 text-purple-800 border border-purple-200",
    };
    return (
      colors[category] ||
      "bg-primary-100 text-primary-800 border border-primary-200"
    );
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={event.image || "/api/placeholder/600/400"}
            alt={event.title}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>

        {/* Event date badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-3 py-1 bg-primary-500 text-white text-xs font-bold">
              {new Date(event.startDate).toLocaleDateString("en-US", {
                month: "short",
              })}
            </div>
            <div className="px-3 py-1 font-bold text-center text-primary-700">
              {new Date(event.startDate).getDate()}
            </div>
          </div>
        </div>

        {/* Favorite and admin actions */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleFavoriteToggle}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
          >
            {isFavorite ? (
              <HeartIconSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {isAdmin && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link
                to={`/events/edit/${event._id}`}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
              >
                <PencilIcon className="w-5 h-5 text-blue-600" />
              </Link>
              <button
                onClick={() => onDelete(event._id)}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
              >
                <TrashIcon className="w-5 h-5 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(
              event.category
            )}`}
          >
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-2 text-primary-500" />
            <span>
              {new Date(event.startDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="w-4 h-4 mr-2 text-primary-500" />
            <span>{event.venue?.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="w-4 h-4 mr-2 text-primary-500" />
            <span>{event.registrations?.length || 0} registered</span>
          </div>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="mt-2 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const CategoryFilterChip = ({ category, isActive, onClick }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Academic":
        return <AcademicCapIcon className="h-5 w-5" />;
      case "Sports":
        return <TrophyIcon className="h-5 w-5" />;
      case "Cultural":
        return <MusicalNoteIcon className="h-5 w-5" />;
      case "Technical":
        return <WrenchIcon className="h-5 w-5" />;
      case "Workshop":
        return <LightBulbIcon className="h-5 w-5" />;
      default:
        return <CalendarIcon className="h-5 w-5" />;
    }
  };

  return (
    <button
      onClick={() => onClick(category)}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
        isActive
          ? "bg-primary-100 text-primary-700 border border-primary-300"
          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
      }`}
    >
      <span className="mr-1.5">{getCategoryIcon(category)}</span>
      {category}
    </button>
  );
};

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    sort: "-createdAt",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = [
    "All",
    "Academic",
    "Sports",
    "Cultural",
    "Technical",
    "Workshop",
    "Chess",
    "Basketball",
    "Swimming",
    "Athletics",
    "Cricket",
    "Badminton",
    "Table Tennis",
    "Hackathons",
  ];

  useEffect(() => {
    dispatch(getEvents(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryFilter = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: category === "All" ? "" : category,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(getEvents(filters)).then(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await dispatch(deleteEvent(eventId)).unwrap();
        toast.success("Event deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete event");
      }
    }
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Ongoing";
    return "Completed";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Create Event Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="inline-flex items-center justify-center bg-primary-50 text-primary-600 px-4 py-1 rounded-full mb-2">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Browse Events</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Events Calendar
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all ${
                isRefreshing ? "animate-spin" : ""
              }`}
              disabled={isRefreshing}
            >
              <ArrowPathIcon className="h-5 w-5 text-gray-600" />
            </button>

            <div className="hidden sm:flex items-center space-x-1 rounded-lg bg-white shadow-sm p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <TableCellsIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>

            {isAuthenticated && (
              <Link
                to="/events/create"
                className="inline-flex items-center px-4 py-2 rounded-lg shadow-md text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Event
              </Link>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="mb-6 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex space-x-2">
            {categories.slice(0, 8).map((category) => (
              <CategoryFilterChip
                key={category}
                category={category}
                isActive={
                  filters.category === (category === "All" ? "" : category)
                }
                onClick={handleCategoryFilter}
              />
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-md rounded-xl mb-8 backdrop-blur-sm bg-white/80">
          <form onSubmit={handleSearch} className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/60 backdrop-blur-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Search
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
                <ChevronDownIcon
                  className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Filter Options */}
            <div
              className={`mt-4 space-y-4 ${showFilters ? "block" : "hidden"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="pl-3 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="pl-3 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sort"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sort By
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="pl-3 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="-startDate">Upcoming First</option>
                    <option value="startDate">Past First</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Events Display */}
        {loading ? (
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md text-center py-16">
            <CalendarIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              No events found
            </h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              We couldn't find any events matching your criteria. Try adjusting
              your search or filters.
            </p>
            {isAuthenticated && (
              <div className="mt-8">
                <Link
                  to="/events/create"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Your First Event
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Event Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-700">
                Showing <span className="font-medium">{events.length}</span>{" "}
                events
              </p>

              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">View:</p>
                <div className="flex sm:hidden items-center space-x-1 rounded-lg bg-white shadow-sm p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded ${
                      viewMode === "grid"
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <TableCellsIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded ${
                      viewMode === "list"
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Event Grid */}
            <div
              className={`grid grid-cols-1 ${
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""
              } gap-6 md:gap-8`}
            >
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onDelete={handleDeleteEvent}
                  isAdmin={isAuthenticated}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Events;