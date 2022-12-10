import { CategoryEntity } from './../../src/components/category/entities/category.entity'
import { Connection } from 'typeorm'
export default class CategoriesTableSeeder {
  async up(connection: Connection): Promise<any> {
    const seed = [
      {
        name: 'Lẩu',
        slug: 'lau',
        thumbnail:
          'https://pastaxi-manager.onepas.vn//Upload/DanhMucHienThi/Avatar/638036438488453397-lau-pasgo.vn.png',
      },
      {
        name: 'Nướng',
        slug: 'nuong',
        thumbnail:
          'https://pastaxi-manager.onepas.vn//Upload/DanhMucHienThi/Avatar/638036438381109666-nuong-pasgo.vn.png',
      },
      {
        name: 'Buffet',
        slug: 'buffet',
        thumbnail:
          '	https://pastaxi-manager.onepas.vn//Upload/DanhMucHienThi/Avatar/638011835542960712-Buffet-Pasgo.png',
      },
      {
        name: 'Hải sản',
        slug: 'hai-san',
        thumbnail:
          '	https://pastaxi-manager.onepas.vn//Upload/DanhMucHienThi/Avatar/638011847245865102-hai-san-pasgo.png',
      },
      {
        name: 'Quán nhậu',
        slug: 'quan-nhau',
        thumbnail:
          'https://pastaxi-manager.onepas.vn//Upload/DanhMucHienThi/Avatar/638011851008641451-quan-nhau-pasgo.png',
      },
      {
        name: 'Món Nhật',
        slug: 'mon-nhat',
        thumbnail:
          'https://pastaxi-manager.onepas.vn//Upload/DanhMucHienThi/Avatar/638011867970619295-mon-nhat-ban-pasgo.png',
      },
      {
        name: 'Món Việt',
        slug: 'mon-viet',
        thumbnail:
          'https://pastaxi-manager.onepas.vn//Upload/DanhMucHienThi/Avatar/638011878657732280-mon-viet-pasgo.png',
      },
      {
        name: 'Món Hàn',
        slug: 'mon-han',
        thumbnail:
          'https://pastaxi-manager.onepas.vn//Upload/DanhMucHienThi/Avatar/638011879614827772-mon-han-quoc-pasgo.png',
      },
      {
        name: 'Món chay',
        slug: 'mon-chay',
        thumbnail:
          'https://pastaxi-manager.onepas.vn//Upload/DanhMucH…nThi/Avatar/638011884827831221-mon-chay-pasgo.png',
      },
    ]
    const Categories = seed.map((item) => {
      const category = new CategoryEntity()

      category.name = item.name
      category.slug = item.slug
      category.thumbnail = item.thumbnail

      return category
    })
    await connection.manager.save(Categories)
  }
}
