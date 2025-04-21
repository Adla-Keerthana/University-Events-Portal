import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEvent, getEvents } from "../../store/slices/eventSlice";
import { toast } from "react-toastify";
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  TagIcon,
  ClockIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const CreateEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.events);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    registrationFee: "",
    maxParticipants: "",
    points: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    "Academic",
    "Sports",
    "Cultural",
    "Technical",
    "Workshop",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      if (files[0]) {
        setFormData((prev) => ({ ...prev, image: files[0] }));
        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.registrationFee)
      newErrors.registrationFee = "Registration fee is required";
    if (!formData.maxParticipants)
      newErrors.maxParticipants = "Max participants is required";
    if (!formData.points) newErrors.points = "Points is required";
    if (!formData.image) newErrors.image = "Event image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Check if user is authenticated
  //   if (!user || !token) {
  //     toast.error("Please login to create an event");
  //     navigate("/login");
  //     return;
  //   }

  //   // Validate form
  //   if (!validateForm()) return;

  //   try {
  //     // Create date and time string in ISO format
  //     const dateTime = `${formData.date}T${formData.time}:00`;
  //     const startDate = new Date(dateTime);
  //     const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours for end time

  //     // Prepare form data for submission
  //     const eventData = {
  //       title: formData.title.trim(),
  //       description: formData.description.trim(),
  //       startDate: startDate.toISOString(),
  //       endDate: endDate.toISOString(),
  //       startTime: formData.time,
  //       endTime: new Date(endDate).toTimeString().split(" ")[0], // Format as HH:MM:SS
  //       venue: {
  //         name: formData.location.trim(),
  //         location: formData.location.trim(),
  //         capacity: Number(formData.maxParticipants),
  //       },
  //       maxParticipants: Number(formData.maxParticipants),
  //       category: formData.category,
  //       registrationFee: {
  //         amount: Number(formData.registrationFee),
  //         currency: "INR",
  //       },
  //       location: formData.location.trim(),
  //       date: startDate.toISOString(),

  //       organizer: user._id,
  //     };
  //     eventData.append("image", formData.image);

  //     if (formData.image) {
  //       // Convert image to base64
  //       const reader = new FileReader();
  //       reader.readAsDataURL(formData.image);
  //       reader.onloadend = async () => {
  //         const base64Image = reader.result;
  //         const imageData = {
  //           data: base64Image.split(",")[1], // Remove the data:image/jpeg;base64, prefix
  //           contentType: formData.image.type,
  //         };

  //         eventData.image = imageData;

  //         console.log("Sending event data:", eventData);

  //         const result = await dispatch(createEvent(eventData)).unwrap();

  //         if (result) {
  //           // Fetch updated events list
  //           await dispatch(getEvents()).unwrap();

  //           toast.success("Event created successfully!");
  //           navigate("/events");
  //         }
  //       };
  //     } else {
  //       console.log("Sending event data:", eventData);

  //       const result = await dispatch(createEvent(eventData)).unwrap();

  //       if (result) {
  //         // Fetch updated events list
  //         await dispatch(getEvents()).unwrap();

  //         toast.success("Event created successfully!");
  //         navigate("/events");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error creating event:", error);
  //     toast.error(error.message || "Failed to create event");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user || !token) {
      toast.error("Please login to create an event");
      navigate("/login");
      return;
    }

    // Validate form
    if (!validateForm()) return;

    try {
      // Create date and time string in ISO format
      const dateTime = `${formData.date}T${formData.time}:00`;
      const startDate = new Date(dateTime);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours for end time

      // Prepare form data for submission
      const eventData = new FormData();
      eventData.append("title", formData.title.trim());
      eventData.append("description", formData.description.trim());
      eventData.append("startDate", startDate.toISOString());
      eventData.append("endDate", endDate.toISOString());
      eventData.append("startTime", formData.time);
      eventData.append(
        "endTime",
        new Date(endDate).toTimeString().split(" ")[0]
      ); // Format as HH:MM:SS
      eventData.append(
        "venue",
        JSON.stringify({
          name: formData.location.trim(),
          location: formData.location.trim(),
          capacity: Number(formData.maxParticipants),
        })
      );
      eventData.append("maxParticipants", Number(formData.maxParticipants));
      eventData.append("category", formData.category);
      eventData.append(
        "registrationFee",
        JSON.stringify({
          amount: Number(formData.registrationFee),
          currency: "INR",
        })
      );
      eventData.append("location", formData.location.trim());
      eventData.append("date", startDate.toISOString());
      eventData.append("organizer", user._id);

      // If there is an image, append it as a file (not as base64)
      if (formData.image) {
        eventData.append("image", formData.image); // formData.image should be a File object
      }

      console.log("Sending event data:", eventData);

      // Make the API call
      const result = await dispatch(createEvent(eventData)).unwrap();

      if (result) {
        // Fetch updated events list
        await dispatch(getEvents()).unwrap();

        toast.success("Event created successfully!");
        navigate("/events");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event");
    }
  };

  const getErrorClass = (fieldName) => {
    return errors[fieldName]
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-primary-500 focus:ring-primary-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/events")}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to events"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        </div>

        <div className="bg-white shadow rounded-xl overflow-hidden">
          {/* Form header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Event Details</h2>
            <p className="text-primary-100 text-sm mt-1">
              Fill in the information below to create your event
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
            encType="multipart/form-data"
          >
            {/* Main form content */}
            <div className="space-y-8">
              {/* Basic Information Section */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200 mb-4">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass(
                          "title"
                        )}`}
                        placeholder="Enter a descriptive title for your event"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TagIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass(
                          "description"
                        )}`}
                        placeholder="Describe your event in detail"
                      />
                      <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass(
                          "date"
                        )}`}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass(
                          "time"
                        )}`}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                    )}
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass(
                          "location"
                        )}`}
                        placeholder="Enter event location"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass(
                          "category"
                        )}`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TrophyIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Fee <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="registrationFee"
                        value={formData.registrationFee}
                        onChange={handleChange}
                        min="0"
                        className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass(
                          "registrationFee"
                        )}`}
                        placeholder="Enter registration fee"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.registrationFee && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.registrationFee}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        min="1"
                        className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass(
                          "maxParticipants"
                        )}`}
                        placeholder="Enter maximum number of participants"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.maxParticipants && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.maxParticipants}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="points"
                        value={formData.points}
                        onChange={handleChange}
                        min="0"
                        className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass(
                          "points"
                        )}`}
                        placeholder="Enter points for participation"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TrophyIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.points && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.points}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Image <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="mx-auto h-32 w-32 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  image: null,
                                }));
                                setImagePreview(null);
                              }}
                              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="image-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="image-upload"
                                  name="image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;