import React, { useState } from 'react';
import { 
  useNavigation,
  NavigationProp,
  ParamListBase,
  useRoute,  
} from '@react-navigation/native';

import { useTheme } from 'styled-components';
import { StatusBar } from 'react-native';

import { format } from 'date-fns'
import { Button } from '../../components/Button';
import { 
  Calendar, 
  DayProps, 
  generateInterval,
  MarkedDateProps
} from '../../components/Calendar';
import { CarDTO } from '../../dtos/CarDTO';
import { BackButton } from '../../components/BackButton';
import ArrowSvg from '../../assets/arrow.svg';
import { getPlatformDate } from '../../utils/getPlatformDate';


import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer

} from './styles';


interface Params {
  car: CarDTO;
}

interface RentalPeriod{  
  startFormatted: string;  
  endFormatted: string;
}

export function Scheduling(){

  const [lastSelectedDate, setLastSelectedDate]= useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);


  const theme = useTheme();

  // versão 6 do navigation deve ser utilizada dessa maneira
  const { navigate, goBack }: NavigationProp<ParamListBase> = useNavigation();

  const route = useRoute();

  const { car } = route.params as Params;



  function handleConfirmRental() {

    navigate('SchedulingDetails', {
      car,
      dates: Object.keys(markedDates),
    });

  }

  function handleBack() {
    goBack();
  }

  function handleChangeDate(date: DayProps){
    
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    // forcar a sempre pegar a data menor para o inicio
    if(start.timestamp > end.timestamp){
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start,end);
    setMarkedDates(interval);

    const firstDate =Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length -1];

    setRentalPeriod({      
      startFormatted: format(getPlatformDate(new Date(firstDate)),'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(new Date(endDate)),'dd/MM/yyyy')
    });

  }

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
        <Title>Escolha uma {'\n'} 
               data de início e {'\n'}
               fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod.startFormatted}>{rentalPeriod.startFormatted}</DateValue>
          </DateInfo>
          <ArrowSvg/>
          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue selected={!!rentalPeriod.endFormatted}>{rentalPeriod.endFormatted}</DateValue>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar        
          markedDates={markedDates}
          onDayPress={handleChangeDate}                 
        />
      </Content>
      <Footer>
        <Button
          title='Confirmar'
          onPress={handleConfirmRental}
          enabled={!!rentalPeriod.startFormatted}
        />
      </Footer>
    </Container>
  );
}