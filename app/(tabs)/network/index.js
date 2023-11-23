import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import axios from "axios";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);

  //decode user id
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  //fetch user profile
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/profile/${userId}`
      );
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.log("error fetching user: " + error);
    }
  };

  //fetch user who connected with user logged in

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  const fetchUsers = async () => {
    try {
      axios.get(`http://localhost:8000/users/${userId}`).then((response) => {
        setUsers(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(users)

  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
