import mongoose from "mongoose";
import { connDB } from "./src/ConnDB.js";
import { config } from "./src/config/config.js";

let argumentos=process.argv
console.log(argumentos)
if(!argumentos[2]){
    console.log(`Ingrese clave`)
    process.exit() 
}
if(argumentos[2]!="CoderCoder123"){
    console.log(`Clave incorrecta`)
    process.exit() 
}

await connDB(config.MONGO_URL, config.DB_NAME)

let products = [
    {
        id: 1,
        category: "Tintos",
        title: "Catena Zapata",
        code: "Estiba Reservada",
        price: 250000,
        status: true,
        description: "Notas: Elegido el momento de la cosecha se seleccionan lotes en cada viñedo, luego se seleccionan plantas en cada lote elegido, luego los racimos que, una vez descobajados, terminan fermentando en pequeños barriles de roble francés, donde permanecen estacionados por aproximadamente 24 meses. Finalmente se seleccionan aquellos barriles que serán embotellados.",
        thumbnails: [
             "./data/imagenes/EstibaReservada.jpeg"
        ],
        stock: 5
   },
   {
        id: 2,
        category: "Tintos",
        title: "Felipe Rutini",
        code: "Felipe Rutini",
        price: 220000,
        status: true,
        description: "Etiqueta ultra premium de la bodega, elegido entre los 50 Top Wines de América del Sur y es el mejor puntuado entre los vinos argentinos de bodegas tradicionales. Su producción se inició en 1985, como homenaje a Don Felipe Rutini y al centenario de labor de la bodega que él fundara. Fue el primer vino argentino en llevar un nombre propio en la etiqueta. Constituye la quintaesencia de la más alta calidad que Rutini Wines puede ofrecer en la creación de vinos considerados extraordinarios.",
        thumbnails: [
             "./data/imagenes/FelipeRutini.jpeg"
        ],
        stock: 100
   },
   {
        id: 3,
        category: "Tintos",
        title: "Susana Balbo",
        code: "Nosotros",
        price: 200000,
        status: true,
        description: "Susana Balbo es una bodega familiar, especializada en la elaboración de vinos de alta gama, ubicada en Agrelo, en el corazón de Luján de Cuyo, a media hora de la ciudad de Mendoza, Argentina, al pie de la cordillera de Los Andes. Fue fundada en 1999 por Susana Balbo, primera mujer enóloga de la Argentina. Luego de más de 10 años de crecimiento constante en mercados internacionales, otro de los sueños de Susana se hizo realidad: sus hijos, José Lovaglio y Ana Lovaglio, decidieron continuar con la tradición familiar e integrarse al equipo. La nueva generación de la familia, junto a un equipo de 100 personas, continúa trabajando a diario en cuidar cada detalle para entregar vinos de la mejor calidad, apostando por el crecimiento de la industria del vino a través de la exploración, la innovación y la sustentabilidad.",
        thumbnails: [
             "./data/imagenes/Nosotros.jpeg"
        ],
        stock: 50
   },
   {
        id: 4,
        category: "Tintos",
        title: "Walter Bressia",
        code: "del Alma",
        price: 180000,
        status: true,
        description: "La última hoja siempre trae felicidad y satisfacción porque, para alcanzar ese momento, atravesamos muchos otros con gran esfuerzo y enorme dedicación. Porque nació del esfuerzo por conseguir lo mejor. Es el fruto del crecimiento y la dedicación que nos permitieron alcanzar tanta satisfacción en un vino de grandes atributos y mensajes profundos. Es el resultado de la experiencia de miles y miles de últimas hojas que nos permitió seleccionar las barricas destacadas e inigualables en una experiencia única e irrepetible.",
        thumbnails: [
             "./data/imagenes/delAlma.jpeg"
        ],
        stock: 100
   },
   {
        id: 5,
        category: "Blancos",
        title: "Catena Zapata",
        code: "Angélica Zapata",
        price: 22000,
        status: true,
        description: "Angélica Chardonnay refleja características propias de la zona de gran altitud en donde se origina. Con días soleados y cálidos, y noches frescas al pie del Cordón del Plata, las uvas de Chardonnay adquieren una madurez plena y bien balanceada. Su color es amarillo intenso con reflejos verdosos claros. En nariz se presenta concentrado e intenso, con aromas de frutas cítricas y un toque mineral. En boca, de impacto dulce, untuoso, es brillante y fresco con sabores a frutas maduras, notas de vainilla y una excelente acidez natural que le otorga un final largo y persistente.",
        thumbnails: [
             "./data/imagenes/AngelicaZapata-Chardonnay.png"
        ],
        stock: 10
   },
   {
        id: 6,
        category: "Blancos",
        title: "Walter Bressia",
        code: "Lagrima Canela",
        price: 20000,
        status: true,
        description: "Lágrimas de alegría y felicidad, apasionadas y sensuales, son arrancadas por este blend desde lo más íntimo para transformarlas en placer e hipnotismo. La canela del alma las combina junto a la dulzura y el delirio en este original assemblage. es un vino de color amarillo verdoso de buena intensidad con reflejos dorados de gran luminosidad. De elegantes aromas frescos y florales aportados por los varietales asociados a las maderas de su crianza en roble. En boca se presenta con muy buen cuerpo, gran untuosidad pero a la vez fresco y floral. es un vino de mucha fineza y sutil elegancia.",
        thumbnails: [
             "./data/imagenes/LagrimaCanela.jpeg"
        ],
        stock: 1
   },
   {
        id: 7,
        category: "Blancos",
        title: "Casa Boher",
        code: "Gran Chardonnay",
        price: 18000,
        status: true,
        description: "100% Chardonnay del Valle de Uco, Mendoza, Argentina. El total del volumen de este vino maduró en barricas de roble Americano y Francés de primer uso durante 12 meses. Terminada la crianza, se realizó una selección de barricas para conformar el corte de 4.000 botellas únicas.",
        thumbnails: [
             "./data/imagenes/CasaBoher-GranChardonnay.jpeg"
        ],
        stock: 100
   },
   {
        id: 8,
        category: "Blancos",
        title: "Luigi Bosca",
        code: "Chardonnay",
        price: 14000,
        status: true,
        description: "Luigi Bosca Chardonnay es un blanco de color amarillo brillante. Sus aromas remiten a frutas blancas levemente tropicales, en armonía con notas cítricas y florales. Su entrada en boca es redonda y compacta, de paladar definido, buen volumen y carácter frutal maduro. Su acidez equilibrada le aporta una agradable vivacidad. Final expresivo y amplio, con un dejo floral muy elegante y una larga persistencia.",
        thumbnails: [
             "./data/imagenes/LuigiBoscaChardonnay.jpeg"
        ],
        stock: 100
   },
   {
        id: 9,
        category: "Rosados",
        title: "Susana Balbo",
        code: "Signature Rosé",
        price: 32000,
        status: true,
        description: "Aroma a frutos rojos combinados con notas florales y citricas. Sabor con buen volumen y paladar franco. Paso graso con tensión, sabores suaves y fugaces, pero persistentes.",
        thumbnails: [
             "./data/imagenes/Signature-Rose.jpeg"
        ],
        stock: 100
   },
   {
        id: 10,
        category: "Rosados",
        title: "Casa Boher",
        code: "Casa Boher Rosé",
        price: 22000,
        status: true,
        description: "Molienda y separación de pieles y semillas en prensa neumática. Desborre en tanques de acero inoxidable de cada varietal por separado, por maceración fría. Su conjunto se co-fermentó a temperaturas bajas controladas y con el agregado de levaduras seleccionadas. Terminada la fermentación alcohólica se separaron las borras mediante un trasiego y se conservó el vino en tanque de acero inoxidable. El embotellado del vino filtrado y limpio se llevó a cabo en Junio del mismo año.",
        thumbnails: [
             "./data/imagenes/CasaBoherRose.jpeg"
        ],
        stock: 100
   },
   {
        id: 11,
        category: "Rosados",
        title: "Luigi Bosca",
        code: "Rose",
        price: 15000,
        status: true,
        description: "Rosé es un vino de color tenue y brillante con reflejos cobrizos. Sus aromas son vibrantes, con notas de frutas rojas, membrillo, miel y flores blancas. En boca es vivaz y refrescante, de paladar franco y tenso. Es un rosado voluptuoso, con agarre y un carácter expresivo y bien sutil. De buen cuerpo, final persistente y delicado. Es un rosado innovador y original que va evolucionando desde el viñedo. La imagen es ilustrativa, la añada puede cambiar según disponibilidad.",
        thumbnails: [
             "./data/imagenes/LuigiBoscaRose.jpeg"
        ],
        stock: 100
   },
   {
        id: 12,
        category: "Rosados",
        title: "Domain Bousquet",
        code: "Gaia Rose",
        price: 10000,
        status: true,
        description: "Rosa claro pálido. Aroma de fresas y frutos rojos con notas florales y de cáscara de naranja. En boca cremosidad leve y marcada acidez.",
        thumbnails: [
             "./data/imagenes/DomaineBousquetGaiaRose.jpeg"
        ],
        stock: 100
   },
   {
        id: 13,
        category: "Espumantes",
        title: "Rosell Boher",
        code: "Brut",
        price: 25000,
        status: true,
        description: "Presenta un color amarillo oro pálido, espuma persistente y burbujas muy pequeñas. Encontramos aromas a pan tostado, frutas tropicales, toques de almendra y coco. Buena acidez. Pleno en boca, de mucho cuerpo, largo y sin amargos. Sabores coherentes con lo que promete a la nariz. Hay duraznos y algo de cereza. Cítricos como pomelo rosado y frutas tropicales.",
        thumbnails: [
             "./data/imagenes/RosellBoher.jpg"
        ],
        stock: 100
   },
   {
        id: 14,
        category: "Espumantes",
        title: "Luigi Bosca",
        code: "Boheme",
        price: 20000,
        status: true,
        description: "Luigi Bosca Bohème Brut Nature es un espumoso de color dorado brillante. Sus aromas son delicados y elegantes, con notas que recuerdan a frutas blancas, frutos secos y pan tostado. En boca es vivaz y refrescante, de paladar franco y equilibrado, con burbujas finas y persistentes. Es de carácter complejo, con buena estructura y fineza en su paso por boca; un vino sofisticado concebido para celebrar momentos únicos. La imagen es ilustrativa, la añada puede cambiar según disponibilidad.",
        thumbnails: [
             "./data/imagenes/LuigiBoscaBoheme.jpeg"
        ],
        stock: 100
   },
   {
        id: 15,
        category: "Espumantes",
        title: "Chandon",
        code: "Baron B Nature",
        price: 18000,
        status: true,
        description: "Representa el estilo Baron B por su intensidad, complejidad, elegancia y delicadeza. De color amarillo dorado con destellos verdes. Aromas minerales, florales y sutiles trazas especiadas a anís. Su paladar se percibe al mismo tiempo fresco y untuoso, y el prolongado contacto con levaduras le otorga una vibrante textura cremosa.",
        thumbnails: [
             "./data/imagenes/BaronBNature.jpeg"
        ],
        stock: 100
   },
   {
        id: 16,
        category: "Espumantes",
        title: "Cruzat",
        code: "Cuvée Nature",
        price: 14000,
        status: true,
        description: "Caracterizado por sus 24 meses de guarda en tanque y otros 24 meses sobre borras en botella, Cruzat Cuvée se reconoce por ser un vino espumoso con cuerpo y aromas bien definidos, de carácter maduro y amable con persistentes burbujas que le dan una textura cremosa y firme.",
        thumbnails: [
             "./data/imagenes/CruzatCuveeNature.jpeg"
        ],
        stock: 100
   }
];

let resultado=await mongoose.connection.collection("products").deleteMany({})
console.log(resultado)
resultado=await mongoose.connection.collection("products").insertMany(products)
console.log(resultado)

process.exit()