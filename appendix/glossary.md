# Словарь

| Термин | Значение |
|---|---|
| Loader | Общий загрузчик, совместимый с BepInEx 5.4.x |
| Mixins | Source-owned patch engine и высокоуровневые hook/IL helpers |
| Пакет | Папка или `.baldic` с манифестом, кодом и ресурсами |
| Plugin | Unity-компонент из `BepInEx/plugins`, создаваемый chainloader |
| Patcher | В контексте установки — ранний BepInEx патчер; в Mixins `Patcher` — владелец runtime patches |
| Entrypoint | Тип и его метод стадии, выбранный манифестом |
| ModContext | Идентификатор, конфиг, корень, фаза и lifetime владельца |
| Owner | Мод/patch ID, отвечающий за ресурс, callback или цепочку |
| Stage | Общая или игровая стадия загрузки; не отдельный поток |
| Loading phase | Рабочая фаза игрового loading API; порядок не заменяет dependency graph |
| Barrier | Граница, после которой нельзя добавить нового внешнего участника |
| Facade | Собственные типы поверх того же канонического backend |
| Legacy bridge | Явный доступ к совместимому исходному объекту на границе интеграции |
| Prefix/Postfix | Callback до/после исходного метода |
| Transpiler | Преобразование IL при построении patch chain |
| FieldRef | Делегат, возвращающий ссылку на поле без копии значения |
| Early transformer | Pure-код, меняющий metadata/IL до загрузки assembly |
| Prepared SDK | Локальные compile references с теми же ранними преобразованиями |
| ResourceId | Пространство имён и путь `namespace:path` для ресурсов/attachments |
| Attachment | Типизированные данные на reference identity, не изменение класса |
| Game/API variant | Полная реализация пакета для выбранной игры |
| Restart required | Настройка активации сохранена, но исполняемый DLL ещё загружен |
| CLR identity | Имя/version/token assembly и полное имя типа, а не его `using`-alias |

`Baldic.Api.Lua` — историческое имя пространства typed C# registry. Оно не означает наличие Lua-интерпретатора.
