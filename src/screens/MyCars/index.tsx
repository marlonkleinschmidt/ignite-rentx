import React, { useState, useEffect } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { 
  useNavigation,
  NavigationProp,
  ParamListBase,
  useRoute,  
} from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { AntDesign } from '@expo/vector-icons'; 
import { Car } from '../../components/Car';

import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';
import { BackButton } from '../../components/BackButton';
import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
  
} from './styles';
import { Load } from '../../components/Load';
import {LoadAnimation} from '../../components/LoadAnimation'

interface CarProps{
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string;
  endDate: string;
}

export function MyCars(){

  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  // versão 6 do navigation deve ser utilizada dessa maneira
  const { navigate, goBack }: NavigationProp<ParamListBase> = useNavigation();

  function handleBack() {
    goBack();
  }



  useEffect(()=>{

    async function fetchCars() {
      try {
        const response = await api.get('schedules_byuser?user_id=1');
        setCars(response.data);        
      } catch (error) {
        console.log(error);
      }
      finally{
        setLoading(false);
      }
    }

    fetchCars();

  },[]);


  return (
    <Container>
      <Header>
        <StatusBar
          barStyle='light-content'
          translucent
          backgroundColor='transparent'
        
        />
       <BackButton
         onPress={handleBack}
         color={theme.colors.shape}
       />
        <Title>Seus agendamentos, {'\n'} 
               estão aqui.               
        </Title>
        <SubTitle>
          Conforto, segurança e praticidade
        </SubTitle>
        
      </Header>
      { loading ? <LoadAnimation/> : 
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>


          <FlatList
            data={cars}
            keyExtractor= {item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item })=>  (
              <CarWrapper>
                <Car data={item.car}/>
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>    
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign 
                      name='arrowright'
                      size={20}
                      color={theme.colors.title}
                      style={{marginHorizontal: 10}}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>    
                </CarFooter>
              </CarWrapper>
            )}
          />
        </Content>
      }

    </Container>
  );
}