package com.nutrex.planservice.service;

import com.nutrex.planservice.dto.PlanResponse;
import com.nutrex.planservice.dto.SemanaPlanResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PlanCatalogService {

    public List<PlanResponse> getPlans() {
        return List.of(
            PlanResponse.builder()
                .id("diabetes")
                .condicion("Diabetes tipo 2")
                .tipoPlan("Control glucemico")
                .objetivo("Mantener glucosa estable con fibra, proteina magra y carbohidratos de absorcion lenta.")
                .descripcion("Plan enfocado en bajar picos de azucar y mejorar la saciedad durante el dia.")
                .enfoque(List.of(
                    "Porciones moderadas de carbohidratos complejos",
                    "Verduras en cada comida principal",
                    "Proteina magra para mejorar saciedad"
                ))
                .alimentos(List.of("Avena", "Quinoa", "Verduras verdes", "Pollo a la plancha", "Legumbres", "Aguacate"))
                .evitar(List.of("Azucar blanca", "Pan blanco", "Jugos de fruta", "Arroz blanco", "Dulces"))
                .semanas(List.of(
                    semana(1, "Avena con canela y arandanos", "Ensalada de quinoa con pollo", "Sopa de lentejas con verduras"),
                    semana(2, "Huevos revueltos con espinaca", "Filete de tilapia con brocoli", "Crema de zapallo sin azucar"),
                    semana(3, "Yogur natural con semillas de chia", "Pechuga con ensalada verde", "Tofu salteado con vegetales"),
                    semana(4, "Tostada integral con aguacate", "Garbanzos con espinaca", "Caldo de pollo con verduras")
                ))
                .build(),
            PlanResponse.builder()
                .id("hipertension")
                .condicion("Hipertension")
                .tipoPlan("Dieta DASH")
                .objetivo("Reducir sodio y fortalecer el consumo de potasio, magnesio y alimentos frescos.")
                .descripcion("Plan para apoyar el control de la presion arterial con comidas caseras y poco sodio.")
                .enfoque(List.of(
                    "Reducir embutidos, enlatados y sal agregada",
                    "Incluir vegetales y frutas ricas en potasio",
                    "Priorizar preparaciones al horno, vapor o plancha"
                ))
                .alimentos(List.of("Banano", "Espinaca", "Avena", "Salmon", "Nueces", "Remolacha"))
                .evitar(List.of("Sal en exceso", "Embutidos", "Enlatados", "Comida rapida", "Alcohol"))
                .semanas(List.of(
                    semana(1, "Avena con banano y nueces", "Salmon al horno con espinaca", "Crema de remolacha sin sal"),
                    semana(2, "Smoothie de espinaca y mango", "Pollo a la plancha con papa", "Sopa de vegetales casera"),
                    semana(3, "Tostada integral con tomate", "Atun fresco con ensalada", "Lentejas guisadas sin sal"),
                    semana(4, "Yogur con fresas y semillas", "Pavo con verduras al vapor", "Caldo vegetal con quinoa")
                ))
                .build(),
            PlanResponse.builder()
                .id("colesterol")
                .condicion("Colesterol alto")
                .tipoPlan("Cardiosaludable")
                .objetivo("Disminuir grasas saturadas y aumentar fibra soluble y grasas saludables.")
                .descripcion("Plan orientado a proteger el corazon y mejorar el perfil lipidico a mediano plazo.")
                .enfoque(List.of(
                    "Usar aceite de oliva y frutos secos con medida",
                    "Agregar avena, frutas y verduras altas en fibra",
                    "Limitar fritos, carnes rojas y lacteos enteros"
                ))
                .alimentos(List.of("Avena", "Aceite de oliva", "Almendras", "Manzana", "Salmon", "Berries"))
                .evitar(List.of("Frituras", "Mantequilla", "Carnes rojas", "Lacteos enteros", "Embutidos"))
                .semanas(List.of(
                    semana(1, "Avena con manzana y canela", "Salmon con ensalada de espinaca", "Sopa de verduras con aceite de oliva"),
                    semana(2, "Smoothie de berries con avena", "Pechuga con vegetales al vapor", "Crema de brocoli con almendras"),
                    semana(3, "Tostada integral con aguacate", "Atun con ensalada mediterranea", "Lentejas con zanahoria"),
                    semana(4, "Yogur descremado con nueces", "Pollo al horno con berenjena", "Sopa de champinones")
                ))
                .build(),
            PlanResponse.builder()
                .id("renal")
                .condicion("Enfermedad renal")
                .tipoPlan("Cuidado renal")
                .objetivo("Controlar sodio, potasio y fosforo con menus suaves y bien dosificados.")
                .descripcion("Plan pensado para proteger la funcion renal y simplificar la seleccion diaria de alimentos.")
                .enfoque(List.of(
                    "Elegir alimentos bajos en potasio y fosforo",
                    "Moderar proteinas segun tolerancia y control medico",
                    "Evitar procesados y exceso de sal"
                ))
                .alimentos(List.of("Arroz blanco", "Manzana", "Pollo sin piel", "Repollo", "Pepino", "Pan blanco"))
                .evitar(List.of("Banano", "Nueces", "Lacteos", "Legumbres", "Sal", "Alimentos procesados"))
                .semanas(List.of(
                    semana(1, "Pan blanco con mermelada sin azucar", "Arroz blanco con pollo sin sal", "Sopa de repollo y zanahoria"),
                    semana(2, "Manzana con pan tostado", "Pechuga hervida con pepino", "Arroz con verduras bajas en potasio"),
                    semana(3, "Gelatina sin azucar con pera", "Pollo a la plancha con repollo", "Caldo suave de pollo sin sal"),
                    semana(4, "Tostada con aceite de oliva", "Arroz con pechuga y rabano", "Sopa de nabo y zanahoria")
                ))
                .build(),
            PlanResponse.builder()
                .id("obesidad")
                .condicion("Control de peso")
                .tipoPlan("Perdida de grasa")
                .objetivo("Lograr un deficit calorico con buena saciedad y comidas faciles de sostener.")
                .descripcion("Plan con enfoque en proteina magra, fibra y orden de comidas para bajar peso sin rebotes.")
                .enfoque(List.of(
                    "Platos altos en vegetales y proteina magra",
                    "Menos azucar liquida y ultraprocesados",
                    "Desayunos y cenas de alta saciedad"
                ))
                .alimentos(List.of("Pechuga de pollo", "Brocoli", "Huevo", "Quinoa", "Pepino", "Frutas frescas"))
                .evitar(List.of("Ultraprocesados", "Bebidas azucaradas", "Pan blanco", "Frituras", "Alcohol"))
                .semanas(List.of(
                    semana(1, "Huevos con espinaca y cafe sin azucar", "Ensalada de pollo con quinoa", "Sopa de verduras sin grasa"),
                    semana(2, "Yogur griego con fresas", "Pechuga a la plancha con brocoli", "Crema de zapallo sin crema"),
                    semana(3, "Smoothie verde con proteina", "Atun con ensalada mixta", "Pollo al horno con vegetales"),
                    semana(4, "Avena con proteina y berries", "Bowl de quinoa con vegetales", "Sopa de lentejas ligera")
                ))
                .build(),
            PlanResponse.builder()
                .id("general")
                .condicion("Nutricion general")
                .tipoPlan("Balance diario")
                .objetivo("Mejorar habitos con un patron equilibrado y sostenible para todos los dias.")
                .descripcion("Plan ideal para personas que quieren comer mejor, ordenar horarios y mantener energia estable.")
                .enfoque(List.of(
                    "Mitad del plato con verduras variadas",
                    "Granos integrales y proteina en cada comida",
                    "Menos ultraprocesados y mejor hidratacion"
                ))
                .alimentos(List.of("Frutas variadas", "Verduras", "Granos integrales", "Proteina magra", "Legumbres", "Agua"))
                .evitar(List.of("Ultraprocesados", "Azucar en exceso", "Grasas trans", "Alcohol en exceso"))
                .semanas(List.of(
                    semana(1, "Tazon de frutas con granola", "Arroz integral con pollo y ensalada", "Sopa de verduras casera"),
                    semana(2, "Smoothie de mango y espinaca", "Pasta integral con vegetales", "Tortilla de verduras"),
                    semana(3, "Tostadas con aguacate y huevo", "Quinoa con salmon y limon", "Ensalada mediterranea completa"),
                    semana(4, "Yogur con miel y nueces", "Bowl de legumbres mixtas", "Wok de vegetales con tofu")
                ))
                .build()
        );
    }

    private SemanaPlanResponse semana(int semana, String desayuno, String almuerzo, String cena) {
        return SemanaPlanResponse.builder()
            .semana(semana)
            .desayuno(desayuno)
            .almuerzo(almuerzo)
            .cena(cena)
            .build();
    }
}
