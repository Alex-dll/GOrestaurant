import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface NewFood {
  id: number,
  name: string,
  description: string,
  price: string,
  available: boolean,
  image: string,
}

interface DataProps {
  image: string;
  name: string;
  price: number;
  description: string;
}

export default function Dashboard() {
  const [foods, setFoods] = useState<NewFood[]>([])
  const [editingFood, setEditingFood] = useState<NewFood>({} as NewFood)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, SetEditModalOpen] = useState(false)

  
  useEffect(() => {
    async function getFood() {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    getFood()
  }, [])

  const handleAddFood = async (food: DataProps): Promise<void> => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: DataProps): Promise<void> => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number): Promise<void> => {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    SetEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: NewFood)  => {
    SetEditModalOpen(true)
    setEditingFood(food)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

}

