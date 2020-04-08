import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Button,
  Text,
  Divider,
  Card,
  ListItem,
  withTheme,
  Input,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import FoodCard from '../components/FoodCard';
import { container as MealContainer } from '../store/reducers/Meal';
import { container as UserContainer } from '../store/reducers/User'
import { firestoreService } from '../Firebase';

const getTotal = (nutrient: string): CallableFunction => (
  accumulator,
  currentValue
  ): number => accumulator + currentValue[nutrient];
  
  function Day({ navigation, theme, meal, updateMeal, user }): JSX.Element {

  const today = new Date();
  const title = today.toLocaleString('en');
  navigation.setOptions({ title });

  const [mealName, changeMealName] = useState('')

  const getTotals = (): {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  } => {
    const calories = meal.reduce(getTotal('calories'), 0);
    const protein = meal.reduce(getTotal('protein'), 0);
    const carbs = meal.reduce(getTotal('carbs'), 0);
    const fats = meal.reduce(getTotal('fats'), 0);
    return {
      calories,
      protein,
      carbs,
      fats,
    };
  };

  const sendMealToFirestore = async (): Promise<void> => {
    const calories = getTotals().calories;
    try {
      await firestoreService.saveMeal(meal, mealName, user.uid, today, calories);
      updateMeal([]);
      changeMealName('');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ScrollView>
      {meal.length ? (
        meal.map((food: {[key: string]: any }, index: number) => (
          <FoodCard
            name={food.name}
            portion={food.portion}
            calories={food.calories.toString()}
            protein={food.protein.toString()}
            carbs={food.carbs.toString()}
            fats={food.fats.toString()}
            key={index}
          />
        ))
      ) : (
        <Text>No foods added to this meal</Text>
      )}
      <Button
        title="Add a food"
        onPress={(): void => navigation.navigate('Search')}
      />
      {meal.length ? (
        <View>
          <Divider />
          <Card
            containerStyle={{
              backgroundColor: theme.colors.primary,
              marginBottom: 20,
            }}
            title="Totals"
          >
            <ListItem
              title="Calories:"
              subtitle={getTotals().calories.toString()}
              chevron={false}
              containerStyle={{
                backgroundColor: theme.colors.primary,
                borderRadius: 15,
                padding: 10,
              }}
            />
            <ListItem
              title="Protein:"
              subtitle={getTotals().protein.toString()}
              chevron={false}
              containerStyle={{
                backgroundColor: theme.colors.grey0,
                borderRadius: 15,
                padding: 10,
              }}
            />
            <ListItem
              title="Carbs:"
              subtitle={getTotals().carbs.toString()}
              chevron={false}
              containerStyle={{
                backgroundColor: theme.colors.primary,
                borderRadius: 15,
                padding: 10,
              }}
            />
            <ListItem
              title="Fat:"
              subtitle={getTotals().fats.toString()}
              chevron={false}
              containerStyle={{
                backgroundColor: theme.colors.grey0,
                borderRadius: 15,
                padding: 10,
              }}
            />
          </Card>
          <Input 
            placeholder="Enter meal name"
            value={mealName}
            onChangeText={(value) => changeMealName(value)} 
          />
          <Button
            title="Save meal"
            onPress={sendMealToFirestore} 
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

Day.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
  meal: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserContainer(MealContainer(withTheme(Day)));
