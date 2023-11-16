import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMeals } from "../../store/slices/meals";
import { setUsers } from "../../store/slices/users";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const useMealsLogic = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { meals } = useSelector(state => state.meals);
  const { users } = useSelector(state => state.users);
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [maxFoodEntries, setMaxFoodEntries] = useState("");
  const [formFieldError, setFormFieldError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingMealId, setEditingMealId] = useState("");

  useEffect(() => {
    fetchMeals();
    if (auth.isAdmin) fetchUsers();
  }, []);

  useEffect(() => {
    if (!modal) {
      if (auth.isAdmin) setUser("");
      setName("");
      setMaxFoodEntries("");
      setIsEditing(false);
      setEditingMealId("");
      setFormFieldError({});
    }
  }, [modal]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const fetchMeals = async () => {
    try {
      const res = await axios.get("/meals");
      dispatch(setMeals(res.data));
    } catch (error) {
      if (error?.response?.status === 404) {
        dispatch(setMeals([]));
        return;
      }
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
    const data = meals.find(meal => meal._id === id);
    setEditingMealId(id);
    if (auth.isAdmin) setUser(data.user._id);
    setName(data.name);
    setMaxFoodEntries(data.maxFoodEntries);
    setIsEditing(true);
    toggleModal();
  };

  const handleDeleteClick = async id => {
    try {
      setDeletingId(id);
      await axios.delete(`/meals/${id}`);
      fetchMeals();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setDeletingId("");
    }
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      if (!name || !maxFoodEntries || (auth.isAdmin && !user)) {
        setFormFieldError({
          name: !name ? "Meal Name is required" : null,
          maxFoodEntries: !maxFoodEntries
            ? "Maximum Food Entries is required"
            : null,
          user: !user ? "User is required" : null
        });
        return;
      }
      if (
        formFieldError.name ||
        formFieldError.maxFoodEntries ||
        formFieldError.user
      ) {
        return;
      }
      setIsLoading(true);
      const data = {
        name,
        maxFoodEntries
      };
      if (auth.isAdmin) data.userId = user;
      await axios({
        method: isEditing ? "patch" : "post",
        url: `/meals${isEditing ? `/${editingMealId}` : ""}`,
        data
      });
      fetchMeals();
      toggleModal();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxFoodEntriesChange = e => {
    if (!e.target.value) {
      setFormFieldError({
        ...formFieldError,
        maxFoodEntries: "Maximum Food Entries is required"
      });
    } else if (e.target.value <= 0) {
      setFormFieldError({
        ...formFieldError,
        maxFoodEntries: "Maximum Food Entries is too low"
      });
    } else {
      setFormFieldError({
        ...formFieldError,
        maxFoodEntries: ""
      });
    }
    setMaxFoodEntries(e.target.value);
  };

  useEffect(() => {
    if ("add" in router.query) toggleModal();
  }, []);

  const mealProps = {
    auth,
    meals,
    users,
    modal,
    user,
    setUser,
    name,
    setName,
    maxFoodEntries,
    formFieldError,
    setFormFieldError,
    isLoading,
    deletingId,
    isEditing,
    toggleModal,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleMaxFoodEntriesChange
  };

  return mealProps;
};

export default useMealsLogic;
