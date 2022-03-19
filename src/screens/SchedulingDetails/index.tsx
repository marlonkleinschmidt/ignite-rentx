import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTheme } from 'styled-components';
import { 
  useNavigation,
  NavigationProp,
  ParamListBase,
  useRoute,
} from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';

import { format } from 'date-fns';
import { api } from '../../services/api';
import { getPlatformDate } from '../../utils/getPlatformDate';

import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';




import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,  
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
} from './styles';




interface RentalPeriod{  
  start: string;  
  end: string;
}

interface Params {
  car: CarDTO;  
  dates: string[];
}

export function SchedulingDetails(){

  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  // importa useRoute da navegação
  const route = useRoute()
  const theme = useTheme();
  const { car, dates } = route.params as Params;

  const rentTotal = Number(dates.length * car.rent.price);
  

  // versão 6 do navigation deve ser utilizada dessa maneira
  const { navigate, goBack }: NavigationProp<ParamListBase> = useNavigation();

  async function handleConfirmRental() {

    setLoading(true);
    const shedulesByCar = await api.get(`/schedules_bycars/${car.id}`);

    const unavailable_dates = [
      ...shedulesByCar.data.unavailable_dates,
      ...dates,
    ];

    await api.post('schedules_byuser',{
      user_id: 1,
      car,
      startDate: format(getPlatformDate(new Date(dates[0])),'dd/MM/yyyy'),
      endDate: format(getPlatformDate(new Date(dates[dates.length-1])),'dd/MM/yyyy')
    });


    // atualiza as os agenamentos para o carro      
    api.put(`/schedules_bycars/${car.id}`,{
      id: car.id,
      unavailable_dates
    }).then(() => navigate('SchedulingComplete'))
      .catch(()=> {
        setLoading(false); 
        Alert.alert('Não foi possível confirmar o agendamento');
      });
    
  }

  function handleBack() {
    goBack();
  }

  useEffect(()=>{
    setRentalPeriod({
      start: format(getPlatformDate(new Date(dates[0])),'dd/MM/yyyy'),
      end: format(getPlatformDate(new Date(dates[dates.length-1])),'dd/MM/yyyy'),
    });
  },[]);

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBack}/>
      </Header>

      <CarImages>
        <ImageSlider 
          imageUrl={car.photos}
        />
      </CarImages>

      <Content>

        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.rent.period}</Period>
            <Price>R$ {car.rent.price}</Price>
          </Rent>
        </Details>

        <Accessories>
          { car.accessories.map(
            accessory => ( 
              <Accessory 
                key={accessory.type}
                name={accessory.name} 
                icon={getAccessoryIcon(accessory.type)}
              />
            ))
          }
        </Accessories>

        <RentalPeriod>

          <CalendarIcon>
            <Feather 
              name='calendar'
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather 
            name='chevron-right'
            size={RFValue(10)}
            color={theme.colors.text}
          />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>


        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.rent.price} x${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>

      </Content>

      <Footer>
        <Button 
          title='Alugar agora'
          color={theme.colors.success}    
          onPress={handleConfirmRental}
          enabled={!loading}
          loading={loading}      
        />
      </Footer>

    </Container>
  );
}