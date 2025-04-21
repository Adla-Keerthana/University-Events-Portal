import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../store/slices/eventSlice";
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

const EditEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const { currentEvent: event, loading, error } = useSelector((state) => state.events);

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

  useEffect(() => {
    dispatch(getEventById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate);
      setFormData({
        title: event.title,
        description: event.description,
        date: startDate.toISOString().split('T')[0],
        time: event.startTime,
        location: event.venue?.location || event.location,
        category: event.category,
        registrationFee: event.registrationFee?.amount || "",
        maxParticipants: event.maxParticipants,
        points: event.points || "",
        image: null,
      });
      if (event.image) {
        setImagePreview(event.image);
      }
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      if (files[0]) {
        setFormData((prev) => ({ ...prev, image: files[0] }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.registrationFee) newErrors.registrationFee = "Registration fee is required";
    if (!formData.maxParticipants) newErrors.maxParticipants = "Max participants is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("Please login to edit an event");
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    try {
      const dateTime = `${formData.date}T${formData.time}:00`;
      const startDate = new Date(dateTime);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

      const eventData = new FormData();
      eventData.append("title", formData.title.trim());
      eventData.append("description", formData.description.trim());
      eventData.append("startDate", startDate.toISOString());
      eventData.append("endDate", endDate.toISOString());
      eventData.append("startTime", formData.time);
      eventData.append("endTime", new Date(endDate).toTimeString().split(" ")[0]);
      eventData.append("venue", JSON.stringify({
        name: formData.location.trim(),
        location: formData.location.trim(),
        capacity: Number(formData.maxParticipants),
      }));
      eventData.append("maxParticipants", Number(formData.maxParticipants));
      eventData.append("category", formData.category);
      eventData.append("registrationFee", JSON.stringify({
        amount: Number(formData.registrationFee),
        currency: "INR",
      }));
      eventData.append("location", formData.location.trim());
      eventData.append("date", startDate.toISOString());

      if (formData.image) {
        eventData.append("image", formData.image);
      }

      await dispatch(updateEvent({ id, eventData })).unwrap();
      toast.success("Event updated successfully!");
      navigate("/events");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(error.message || "Failed to update event");
    }
  };

  const getErrorClass = (fieldName) => {
    return errors[fieldName]
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-primary-500 focus:ring-primary-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/events")}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to events"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
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
                      className={`block w-full rounded-md shadow-sm pl-10 ${getErrorClass("title")}`}
                      placeholder="Enter a descriptive title for your event"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <TagIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Image
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
                              setFormData((prev) => ({ ...prev, image: null }));
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
                        <div>
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
                                className="sr-only"
                                onChange={handleChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent; 