import {
  FoodEntity,
  FoodInventory,
  FoodStatus,
  FoodType,
} from './../../src/components/food/entities/food.entity'
import { Connection } from 'typeorm'

export default class FoodsTableSeeder {
  async up(connection: Connection): Promise<any> {
    const seed = [
      {
        name: 'Lẩu Thái Ba Chỉ Bò Mỹ',
        slug: 'lau-thai-ba-chi-bo-my',
        categoryId: 1,
        type: FoodType.food,
        summary:
          'Set gồm: 2 lít nước lẩu,2 khay ba chỉ bò mỹ, 1 khay nấm,1 túi rau, ngô, mỳ tôm 2 gói, váng đậu.',
        content:
          'Thời tiết Hà Nội dạo này lại cứ ẩm ương, sáng nắng, chiều mưa không biết đường mà lần, mà cứ mỗi lần mưa là cơn thèm ăn đồ nóng, nhất là món lẩu của các tín đồ ham ăn lại dâng trào lên đúng chứ? Còn gì tuyệt vời hơn một nồi lẩu ấm cúng trong một thời tiết lành lạnh như vậy cho được!',
        discount: 0.1,
        rating: 5,
        price: 234000,
        liked: 5,
        soldQuantity: 123,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://d1sag4ddilekf6.azureedge.net/compressed_webp/items/VNITE2022070404534568565/detail/menueditor_item_c06c54cef93a44bdb37150ee894b0500_1656910379483570017.webp',
      },
      {
        name: 'Buffet Đặc Biệt',
        slug: 'buffet-dac-bỉet',
        categoryId: 3,
        type: FoodType.food,
        summary:
          'Chuẩn vị Hà Thành, đầy đủ vị nước dùng thanh ngọt, không phụ gia, không bột ngọt. Bao Gồm: Thanh Cua, Bò, Giò sụn, Ốc, gạch cua, đậu lướt ván, hành lá, rau dăm, tía tô, xà lách, giá đỗ, bún thang',
        content:
          'Thời tiết Hà Nội dạo này lại cứ ẩm ương, sáng nắng, chiều mưa không biết đường mà lần, mà cứ mỗi lần mưa là cơn thèm ăn đồ nóng, nhất là món lẩu của các tín đồ ham ăn lại dâng trào lên đúng chứ? Còn gì tuyệt vời hơn một nồi lẩu ấm cúng trong một thời tiết lành lạnh như vậy cho được!',
        discount: 0.15,
        rating: 4,
        price: 321000,
        liked: 3,
        soldQuantity: 130,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://d1sag4ddilekf6.azureedge.net/compressed_webp/items/VNITE2022071209530686189/detail/menueditor_item_d41152a048ce4a2d92a57e7e31d87f30_1657619484161579045.webp',
      },
      {
        name: 'Set Sashimi 4: Cá Hồi, Cá Ngừ, Cá Cờ Kiếm, Cá Mú Sao, Cá Hồng Biển - 600g',
        slug: 'set-sashimi-4',
        categoryId: 4,
        type: FoodType.food,
        summary:
          'Set Bao Gồm: 200g Cá Hồi, 100g Cá Ngừ, 100g Cá Cờ Kiếm, 100g Cá Mú Sao, 100g Cá Hồng Biển + Gia vị đi kèm (Nước tương, gừng hồng, mù tạt, lá tía tô, củ cải trắng bào)',
        content:
          'Thời tiết Hà Nội dạo này lại cứ ẩm ương, sáng nắng, chiều mưa không biết đường mà lần, mà cứ mỗi lần mưa là cơn thèm ăn đồ nóng, nhất là món lẩu của các tín đồ ham ăn lại dâng trào lên đúng chứ? Còn gì tuyệt vời hơn một nồi lẩu ấm cúng trong một thời tiết lành lạnh như vậy cho được!',
        discount: 0.15,
        rating: 4,
        price: 599000,
        liked: 9,
        soldQuantity: 330,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://d1sag4ddilekf6.azureedge.net/compressed_webp/items/VNITE2022100707252199243/detail/menueditor_item_35100984bace4e58a120c1c21d35dbb6_1665127519246527822.webp',
      },
      {
        name: 'Set Sashimi 4: Cá Hồi, Cá Ngừ, Cá Cờ Kiếm, Cá Mú Sao, Cá Hồng Biển - 600g',
        slug: 'set-sashimi-4',
        categoryId: 4,
        type: FoodType.food,
        summary:
          'Set Bao Gồm: 200g Cá Hồi, 100g Cá Ngừ, 100g Cá Cờ Kiếm, 100g Cá Mú Sao, 100g Cá Hồng Biển + Gia vị đi kèm (Nước tương, gừng hồng, mù tạt, lá tía tô, củ cải trắng bào)',
        content:
          'Thời tiết Hà Nội dạo này lại cứ ẩm ương, sáng nắng, chiều mưa không biết đường mà lần, mà cứ mỗi lần mưa là cơn thèm ăn đồ nóng, nhất là món lẩu của các tín đồ ham ăn lại dâng trào lên đúng chứ? Còn gì tuyệt vời hơn một nồi lẩu ấm cúng trong một thời tiết lành lạnh như vậy cho được!',
        discount: 0.15,
        rating: 4,
        price: 599000,
        liked: 9,
        soldQuantity: 330,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://d1sag4ddilekf6.azureedge.net/compressed_webp/items/VNITE2022100707252199243/detail/menueditor_item_35100984bace4e58a120c1c21d35dbb6_1665127519246527822.webp',
      },
      {
        name: 'Cá quả nướng',
        slug: 'ca-qua-nuong',
        categoryId: 5,
        type: FoodType.food,
        summary:
          'cá tươi sống,giá vị mắm muối, hạt mắc khén... kèm theo bún bánh đa,dưa chuột,ca rốt, chuối xanh,rau thơm các loại.',
        content:
          'Thời tiết Hà Nội dạo này lại cứ ẩm ương, sáng nắng, chiều mưa không biết đường mà lần, mà cứ mỗi lần mưa là cơn thèm ăn đồ nóng, nhất là món lẩu của các tín đồ ham ăn lại dâng trào lên đúng chứ? Còn gì tuyệt vời hơn một nồi lẩu ấm cúng trong một thời tiết lành lạnh như vậy cho được!',
        discount: 0.15,
        rating: 5,
        price: 220000,
        liked: 2,
        soldQuantity: 121,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://d1sag4ddilekf6.azureedge.net/compressed_webp/items/5-CYWHV2VBANKDE2-CYWHV2VBN2TGVE/detail/4b9c9b2fbf5045ed8ddbd7bb6c9b36b0_1566796241693948468.webp',
      },
      {
        name: 'Dê Ré Song Dương',
        slug: 'de-re-song-duong',
        categoryId: 5,
        type: FoodType.food,
        summary:
          'cá tươi sống,giá vị mắm muối, hạt mắc khén... kèm theo bún bánh đa,dưa chuột,ca rốt, chuối xanh,rau thơm các loại.',
        content:
          '- Nhà hàng Đặc sản Dê Ré Song Dương là sự kết hợp của ca sĩ Trọng Tấn và doanh nhân tài ba Đinh Minh – chủ tịch HĐQT Migroup \n Đội ngũ đầu bếp trên 15 năm kinh nghiệm với hơn 50 món ăn được chế biến từ thịt dê ré',
        discount: 0.2,
        rating: 5,
        price: 620000,
        liked: 2,
        soldQuantity: 125,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-de-re-song-duong-39-tran-kim-xuyen-5-normal-12072257514.jpg',
      },
      {
        name: 'Bia 333',
        slug: 'bia-333',
        categoryId: 5,
        type: FoodType.drink,
        summary: 'Bia 333 thức uống từ lúa mạch',
        content:
          '- Nhà hàng Đặc sản Dê Ré Song Dương là sự kết hợp của ca sĩ Trọng Tấn và doanh nhân tài ba Đinh Minh – chủ tịch HĐQT Migroup \n Đội ngũ đầu bếp trên 15 năm kinh nghiệm với hơn 50 món ăn được chế biến từ thịt dê ré',
        discount: 0.05,
        rating: 5,
        price: 10000,
        liked: 9,
        soldQuantity: 333,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://d1sag4ddilekf6.azureedge.net/compressed_webp/items/VNITE2020112511404846634/detail/menueditor_item_40ba92d6d539400c92a38fc1f4d01be1_1606304480814995330.webp',
      },
      {
        name: 'Cánh gà nướng',
        slug: 'canh-ga-nuong',
        categoryId: 5,
        type: FoodType.snack,
        summary: 'Bia 333 thức uống từ lúa mạch',
        content:
          '- Nhà hàng Đặc sản Dê Ré Song Dương là sự kết hợp của ca sĩ Trọng Tấn và doanh nhân tài ba Đinh Minh – chủ tịch HĐQT Migroup \n Đội ngũ đầu bếp trên 15 năm kinh nghiệm với hơn 50 món ăn được chế biến từ thịt dê ré',
        discount: 0.05,
        rating: 5,
        price: 24000,
        liked: 9,
        soldQuantity: 333,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://d1sag4ddilekf6.azureedge.net/compressed/items/VNITE2021020419570042929/photo/menueditor_item_15c97475ca004b209b2a64f5804918fc_1614975877341113835.jpg',
      },
      {
        name: 'Dê Ré Song Dương',
        slug: 'de-re-song-duong',
        categoryId: 5,
        type: FoodType.food,
        summary:
          'cá tươi sống,giá vị mắm muối, hạt mắc khén... kèm theo bún bánh đa,dưa chuột,ca rốt, chuối xanh,rau thơm các loại.',
        content:
          '- Nhà hàng Đặc sản Dê Ré Song Dương là sự kết hợp của ca sĩ Trọng Tấn và doanh nhân tài ba Đinh Minh – chủ tịch HĐQT Migroup \n Đội ngũ đầu bếp trên 15 năm kinh nghiệm với hơn 50 món ăn được chế biến từ thịt dê ré',
        discount: 0.2,
        rating: 5,
        price: 620000,
        liked: 2,
        soldQuantity: 125,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-de-re-song-duong-39-tran-kim-xuyen-5-normal-12072257514.jpg',
      },
      {
        name: 'Dê Ré Song Dương',
        slug: 'de-re-song-duong',
        categoryId: 5,
        type: FoodType.food,
        summary:
          'cá tươi sống,giá vị mắm muối, hạt mắc khén... kèm theo bún bánh đa,dưa chuột,ca rốt, chuối xanh,rau thơm các loại.',
        content:
          '- Nhà hàng Đặc sản Dê Ré Song Dương là sự kết hợp của ca sĩ Trọng Tấn và doanh nhân tài ba Đinh Minh – chủ tịch HĐQT Migroup \n Đội ngũ đầu bếp trên 15 năm kinh nghiệm với hơn 50 món ăn được chế biến từ thịt dê ré',
        discount: 0.2,
        rating: 5,
        price: 620000,
        liked: 2,
        soldQuantity: 125,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image: '',
      },
      {
        name: 'CƠM CHAY TRỘN TAY CẦM',
        slug: 'com-chay-tron-tay-cam',
        categoryId: 9,
        type: FoodType.food,
        summary:
          'Thành phần: Gạo trắng, cà rốt, đậu phụ, dưa chuột, đậu cove hoặc đậu hà lan, bí đỏ, giò chay, rong biển trộn gia vị Hàn Quốc, vừng vàng, củ cải muối Hàn Quốc, ngưu bàng muối chua ngọt Hàn Quốc, rau mầm, sốt tương, ớt trộn..',
        content:
          '- Nhà hàng Đặc sản Dê Ré Song Dương là sự kết hợp của ca sĩ Trọng Tấn và doanh nhân tài ba Đinh Minh – chủ tịch HĐQT Migroup \n Đội ngũ đầu bếp trên 15 năm kinh nghiệm với hơn 50 món ăn được chế biến từ thịt dê ré',
        discount: 0.2,
        rating: 5,
        price: 69000,
        liked: 2,
        soldQuantity: 125,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://d1sag4ddilekf6.azureedge.net/compressed_webp/items/VNITE2020080317162133514/detail/menueditor_item_0605fb3354964709a478f4586257c1e6_1635919494285417798.webp',
      },
      {
        name: 'Nem cuốn chay Hà Nội',
        slug: 'nem-cuon-chay-ha-noi',
        categoryId: 9,
        type: FoodType.food,
        summary:
          'Thành phần: Gạo trắng, cà rốt, đậu phụ, dưa chuột, đậu cove hoặc đậu hà lan, bí đỏ, giò chay, rong biển trộn gia vị Hàn Quốc, vừng vàng, củ cải muối Hàn Quốc, ngưu bàng muối chua ngọt Hàn Quốc, rau mầm, sốt tương, ớt trộn..',
        content:
          '- Nhà hàng Đặc sản Dê Ré Song Dương là sự kết hợp của ca sĩ Trọng Tấn và doanh nhân tài ba Đinh Minh – chủ tịch HĐQT Migroup \n Đội ngũ đầu bếp trên 15 năm kinh nghiệm với hơn 50 món ăn được chế biến từ thịt dê ré',
        discount: 0.2,
        rating: 5,
        price: 69000,
        liked: 2,
        soldQuantity: 125,
        inventory: FoodInventory.stocking,
        status: FoodStatus.publish,
        image:
          'https://d1sag4ddilekf6.azureedge.net/compressed_webp/items/VNITE2022051503521701248/detail/menueditor_item_fa2e831ddee9418890107d0b38c20efc_1655355896774235559.webp',
      },
    ]
    const Foods = seed.map((item) => {
      const food = new FoodEntity()

      food.type = item.type
      food.name = item.name
      food.slug = item.slug
      food.categoryId = item.categoryId
      food.summary = item.summary
      food.content = item.content
      food.discount = item.discount
      food.rating = item.rating
      food.price = item.price
      food.liked = item.liked
      food.soldQuantity = item.soldQuantity
      food.inventory = item.inventory
      food.status = item.status
      food.image = item.image

      return food
    })
    await connection.manager.save(Foods)
  }
}
