import { useState, useEffect, useMemo } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export function useLocation(options: UseLocationOptions = {}) {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const locationOptions = useMemo(
    () => ({ ...defaultOptions, ...options }),
    []
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    };

    const watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      locationOptions
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [locationOptions]);

  const setManualLocation = (latitude: number, longitude: number) => {
    setLocation({
      latitude,
      longitude,
      error: null,
      loading: false,
    });
  };

  return { ...location, setManualLocation };
}

export default useLocation;
