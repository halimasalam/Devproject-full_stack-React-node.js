import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFoodEntries } from "../../store/slices/foodEntries";
import { setMeals } from "../../store/slices/meals";
import { setCalorieLimits } from "../../store/slices/calorieLimits";
import { setUsers } from "../../store/slices/users";
import axios from "axios";
import { toast } from "react-toastify";

const useFoodEntriesLogic = () => {
  const todayRef = useRef(new Date().toISOString().split("T")[0]);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { foodEntries } = useSelector(state => state.foodEntries);
  const { meals } = useSelector(state => state.meals);
  const { users } = useSelector(state => state.users);
  const [modal, setModal] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [calorie, setCalorie] = useState("");
  const [date, setDate] = useState(todayRef.current);
  const [meal, setMeal] = useState("");
  const [user, setUser] = useState("");
  const [formFieldError, setFormFieldError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingFoodEntryId, setEditingFoodEntryId] = useState("");

  useEffect(() => {
    fetchFoodEntries();
    fetchMeals();
    fetchCalorieLimits();
    if (auth.isAdmin) fetchUsers();
  }, []);

  useEffect(() => {
    if (!modal) {
      setFoodName("");
      setCalorie("");
      setDate(todayRef.current);
      setMeal("");
      setUser("");
      setIsEditing(false);
      setEditingFoodEntryId("");
      setFormFieldError({});
    }
  }, [modal]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const fetchFoodEntries = async () => {
    try {
      const res = await axios.get("/foodEntries");
      dispatch(
        setFoodEntries(
          auth.isAdmin
            ? res.data
            : res.data.map(foodEntry => ({
                ...foodEntry,
                user: { name: auth.name, email: auth.email }
              }))
        )
      );
    } catch (error) {
      if (error?.response?.status === 404) {
        dispatch(setFoodEntries([]));
        return;
      }
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchMeals = async () => {
    try {
      const res = await axios.get("/meals");
      dispatch(
        setMeals(
          auth.isAdmin
            ? res.data
            : res.data.map(meal => ({
                ...meal,
                user: { name: auth.name, email: auth.email }
              }))
        )
      );
    } catch (error) {
      if (error?.response?.status === 404) {
        dispatch(setMeals([]));
        return;
      }
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchCalorieLimits = async () => {
    try {
      const res = await axios.get("/reports/getCaloriesLimitPerDay");
      dispatch(setCalorieLimits(res.data));
    } catch (error) {
      if (error?.response?.status === 404) return;
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      dispatch(setUsers(res.data));
    } catch (error) {
      if (error?.response?.status === 404) return;
      toast.error(error?.response?.data?.message);
    }
  };

  const handleEditClick = id => {
    const data = foodEntries.find(foodEntry => foodEntry._id === id);
    setEditingFoodEntryId(id);
    setFoodName(data.foodName);
    setCalorie(data.calorie);
    setDate(data.date.split("T")[0]);
    setMeal(data.meal._id);
    if (auth.isAdmin) setUser(data.user._id);
    setIsEditing(true);
    toggleModal();
  };

  const handleDeleteClick = async id => {
    try {
      setDeletingId(id);
      await axios.delete(`/foodEntries/${id}`);
      fetchFoodEntries();
      fetchCalorieLimits();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setDeletingId("");
    }
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      if (!foodName || !calorie || !date || !meal || (auth.isAdmin && !user)) {
        setFormFieldError({
          foodName: !foodName ? "Food name is required" : null,
          calorie: !calorie ? "Calorie is required" : null,
          date: !date ? "Date is required" : null,
          meal: !meal ? "Meal is required" : null,
          user: auth.isAdmin && !user ? "User is required" : null
        });
        return;
      }
      if (
        formFieldError.foodName ||
        formFieldError.calorie ||
        formFieldError.date ||
        formFieldError.meal ||
        formFieldError.user
      ) {
        return;
      }
      setIsLoading(true);
      const data = {
        foodName,
        calorie,
        date,
        mealId: meal
      };
      if (auth.isAdmin) data.userId = user;
      await axios({
        method: isEditing ? "patch" : "post",
        url: `/foodEntries${isEditing ? `/${editingFoodEntryId}` : ""}`,
        data
      });
      fetchFoodEntries();
      fetchCalorieLimits();
      toggleModal();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalorieChange = e => {
    if (!e.target.value) {
      setFormFieldError({
        ...formFieldError,
        calorie: "Calorie is required"
      });
    } else if (e.target.value <= 0) {
      setFormFieldError({
        ...formFieldError,
        calorie: "Calorie is too low"
      });
    } else if (
      auth.isAdmin && user
        ? Number(e.target.value) >
          Number(users.find(u => u._id === user).caloriesLimitPerDay)
        : Number(e.target.value) > Number(auth.caloriesLimitPerDay)
    ) {
      setFormFieldError({
        ...formFieldError,
        calorie: "Calorie is too high"
      });
    } else {
      setFormFieldError({
        ...formFieldError,
        calorie: ""
      });
    }
    setCalorie(e.target.value);
  };

  const foodEntryProps = {
    todayRef,
    auth,
    foodEntries,
    meals,
    users,
    modal,
    foodName,
    setFoodName,
    calorie,
    date,
    setDate,
    meal,
    setMeal,
    user,
    setUser,
    formFieldError,
    setFormFieldError,
    isLoading,
    deletingId,
    isEditing,
    toggleModal,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleCalorieChange
  };

  return foodEntryProps;
};

export default useFoodEntriesLogic;
