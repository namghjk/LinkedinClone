import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from 'jwt-decode';



const index = () => {
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken =  jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);
  console.log(userId);
  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
