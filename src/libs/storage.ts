import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface PlantProps {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: string;
    repeat_every: string;
  };
  notificationTime: Date;
}

interface StoragePlantProps {
  [id: string]: {
    data: PlantProps;
  };
}

export async function savePlant(plant: PlantProps): Promise<void> {
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const oldPants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    const newPlant = {
      [plant.id]: {
        data: plant,
      },
    };

    await AsyncStorage.setItem(
      '@plantmanager:plants',
      JSON.stringify({ ...newPlant, ...oldPants })
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function loadingPlant(): Promise<PlantProps[]> {
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    const plantsSorted = Object.keys(plants)
      .map((plant) => {
        return {
          ...plants[plant].data,
          hour: format(new Date(plants[plant].data.notificationTime), 'HH:mm'),
        };
      })
      .sort((a, b) =>
        Math.floor(
          new Date(a.notificationTime).getTime() / 1000 -
            Math.floor(new Date(b.notificationTime).getTime() / 1000)
        )
      );

    return plantsSorted;
  } catch (error) {
    throw new Error(error);
  }
}
