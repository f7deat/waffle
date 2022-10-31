namespace Waffle.Models.Components
{
    public class Tree
    {
        public Tree()
        {
            Title = string.Empty;
        }
        public Guid Key { get; set; }
        public string Title { get; set; }
        public List<Tree>? Children { get; set; }
    }
}
