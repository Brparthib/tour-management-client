/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
// import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
import { useGetAllToursQuery } from "@/redux/features/tour/tour.api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Booking() {
  const [guestCount, setGuestCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  console.log(totalAmount);

  const { id } = useParams();
  const { data, isLoading, isError } = useGetAllToursQuery({ _id: id });
  const [createBooking] = useCreateBookingMutation();

  const tourData = data?.[0];

  useEffect(() => {
    if (!isLoading && !isError) {
      setTotalAmount(guestCount * tourData!.costFrom);
    }
  }, [guestCount, totalAmount, isLoading, isError]);

  const incrementGuest = () => {
    setGuestCount((prv) => prv + 1);
  };

  const decrementGuest = () => {
    setGuestCount((prv) => prv - 1);
  };

  const handleBooking = async () => {
    let bookingData;
    if (data) {
      bookingData = {
        tour: id,
        guestCount,
      };
    }

    try {
      const res = await createBooking(bookingData).unwrap();
      if (res.success) {
        window.open(res.data.paymentUrl);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 container mx-auto">
      {!isLoading && isError && (
        <div>
          <p>Something Went Wrong!!</p>{" "}
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div>
          <p>No Data Found</p>{" "}
        </div>
      )}

      {!isLoading && !isError && data!.length > 0 && (
        <>
          {/* Left Section - Tour Summary */}
          <div className="flex-1 space-y-6">
            <div>
              <img
                src={tourData?.images[0]}
                alt={tourData?.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{tourData?.title}</h1>
              <p className="text-gray-600 mb-4">{tourData?.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Location:</strong> {tourData?.location}
                </div>
                <div>
                  <strong>Duration:</strong> {tourData?.startDate} to{" "}
                  {tourData?.endDate}
                </div>
                <div>
                  <strong>Tour Type:</strong> {tourData?.tourType}
                </div>
                <div>
                  <strong>Max Guests:</strong> {tourData?.maxGuest}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">What's Included</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {tourData?.included.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Tour Plan</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {tourData?.tourPlan.map((plan, index) => (
                  <li key={index}>{plan}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Section - Booking Details */}
          <div className="w-full md:w-96">
            <div className="border border-muted p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decrementGuest}
                      disabled={guestCount <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium w-8 text-center">
                      {guestCount}
                    </span>
                    <button
                      onClick={incrementGuest}
                      disabled={guestCount >= tourData!.maxGuest}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Price per person:</span>
                    <span>${tourData?.costFrom}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Guests:</span>
                    <span>{guestCount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full cursor-pointer"
                  size="lg"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
