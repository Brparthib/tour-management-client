import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state);

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email]);

  return (
    <div className="grid place-content-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Verify Your Email address</CardTitle>
          <CardDescription>
            Please enter the 6 digit code we sent to <br />
            {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h1>OTP INPUT HERE</h1>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
