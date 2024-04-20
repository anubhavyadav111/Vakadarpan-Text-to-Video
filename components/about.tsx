const About = () => {
    return (
        <div className="items-center justify-center text-center">
            <div className="text-7xl font-bold">
                Let us tell you <span className="letter-color">a little bit</span> about ourselves.
            </div>
            <div className="flex flex-col justify-center items-center gap-16 mt-12">
                 <div>
                    <iframe
                    width="720" 
                    height="315"
                    src="https://www.youtube.com/watch?v=gHMnUeTRQl8" // Replace with your YouTube video URL
                    title="YouTube Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                    </iframe>
                 </div>
            </div>
            <div className="text-lg pt-12">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
             atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
            sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum
            facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
            impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
            Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates
            repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus,
            ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
            </div>

        </div>
    );
}
 
export default About;