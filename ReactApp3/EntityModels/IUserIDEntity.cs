namespace EntityModels
{
    // Tüm entity'lerde ortak olan ID özelliğini tanımlayan arayüz
    public interface IUserIDEntity
    {
        // Her entity için benzersiz bir ID property
        public int Id { get; set; }
    }
}
