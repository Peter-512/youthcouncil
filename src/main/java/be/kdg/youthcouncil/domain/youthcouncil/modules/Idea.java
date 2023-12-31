package be.kdg.youthcouncil.domain.youthcouncil.modules;

import be.kdg.youthcouncil.domain.media.Image;
import be.kdg.youthcouncil.domain.users.PlatformUser;
import be.kdg.youthcouncil.domain.youthcouncil.interactions.IdeaReaction;
import be.kdg.youthcouncil.domain.youthcouncil.interactions.IdeaShare;
import be.kdg.youthcouncil.domain.youthcouncil.modules.themes.SubTheme;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table (name = "ideas")
@ToString
public class Idea {
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private long ideaId;

	private String idea;
	@ManyToOne
	private SubTheme subTheme;
	@OneToOne
	private Image image;
	@ManyToOne
	private PlatformUser user;

	@ManyToOne
	@JoinColumn (name = "call_for_ideas_call_for_idea_id")
	private CallForIdea callForIdeas;

	@OneToMany (fetch = FetchType.LAZY)
	@ToString.Exclude
	private List<IdeaShare> shares;
	@OneToMany (fetch = FetchType.LAZY)
	@JoinColumn (name = "idea_reacted_on")
	@ToString.Exclude
	private List<IdeaReaction> reactions;
	private String fullName;

	public Idea(String idea, SubTheme subTheme, Image image, PlatformUser user, CallForIdea callForIdeas) {
		this.idea = idea;
		this.subTheme = subTheme;
		this.image = image;
		this.user = user;
		this.callForIdeas = callForIdeas;
	}

	public void addReaction(IdeaReaction reaction) {
		reactions.add(reaction);
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
}
