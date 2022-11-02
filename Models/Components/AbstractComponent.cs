namespace Waffle.Models.Components
{
    public abstract class AbstractComponent
    {
        public AbstractComponent()
        {
            ClassName = string.Empty;
        }
        public string ClassName { get; set; }
    }
}
