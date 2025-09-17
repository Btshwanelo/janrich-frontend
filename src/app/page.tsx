"use client";
import React, { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.href = "/dashboard";
  }, []);

  return <div></div>;
};

export default Index;
