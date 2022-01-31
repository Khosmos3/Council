
function getFont(fmti, fontSize, fontFamily) {
	const fmt = fmti ? fmti
		.split("")
		.map(v => ({
			b: "bold",
			i: "italic"
		}[v]))
		.join(" ") : "";

	const font = `${fmt} ${fontSize}/1 ${fontFamily}`;

	return font;
}

function extractFormatting(text) {
	let format = new Array(text.length).fill("");

	let output = "";

	let bold = false;
	let italic = false;

	let escaped = false;
	for (let t = 0; t < text.length; t++) {
		const char = text[t];

		if (char == "&" && !escaped)
			italic = !italic;
		else if (char == "#" && !escaped)
			bold = !bold;
		else if (char !== "\\" || escaped) {
			output += char;
			const fInx = output.length - 1;
			if (bold) format[fInx] += "b";
			if (italic) format[fInx] += "i";
		}

		escaped = char === "\\" && !escaped;
	}

	format = format.slice(0, output.length);

	return { text: output, format };
}

function getFormattedHTML(text, format, fontSize = "16px", fontFamily = "Arial") {
	let out = "";
	let currentFont = "";
	for (let i = 0; i < text.length; i++) {
		const font = getFont(format[i], fontSize, fontFamily);

		if (font !== currentFont) {
			if (currentFont.length) out += "</span>";
			out += `<span style="font: ${font};">`;
			currentFont = font;
		}

		const char = text[i];
		if (char === "\n") out += "<br>";
		else out += char;
	}
	out += "</span>";

	return out;
}



class Proverb {
	constructor(line) {
		line = line.trim();
		const index = line.lastIndexOf("|");
		if (index === -1) {
			this.text = line;
			this.authors = ["unknown"];
		} else {
			this.text = line
				.slice(0, index)
				.trim();
			this.authors = line
				.slice(index + 1)
				.split("/")
				.map(author => author.trim());
		}

		this.length = 1;
		let escaped = false;
		for (let i = 0; i < this.text.length; i++) {
			const char = this.text[i];
			if (char == "/" && !escaped) this.length++;
			escaped = char === "\\" && !escaped;
		}
	}
}


class Scroll {
	constructor(title, proverbs) {
		this.title = title;
		this.proverbs = proverbs
			.trim()
			.split("\n")
			.filter(line => line.trim().length > 0)
			.map(line => new Proverb(line));
		this.size = this.proverbs.length;
	}
	computeWeight(totalSize) {
		this.weight = this.size / totalSize;
	}
	getProverbLocation(proverb, index = this.proverbs.indexOf(proverb)) {
		let newLines = 0;

		let place = 1;
		for (let i = 0; i < index; i++)
			place += this.proverbs[i].length + 2;

		const location = place + (proverb.length > 1 ? "-" + (place + proverb.length - 1) : "");

		return location;
	}
}


const scrolls = [
	//uncatergorized proverbs	
	new Scroll("Onter", `
		&Maybe we'll prune them sometime / Maybe they'll grow& | hyacinth
	`),
	//actual kinda philosophy thats more clear and just very high tier stuff | from now on will require a consensus between 2 prophets to add to
	new Scroll("Illuminating", `
		Do not give in to fear | tom
		You're a dream... A nightmare... | AI
		The dappled light upon the ground reminds me of the distance | henry
		My consciousness glints in the autumn light | henry
		It's boring to be obvious | henry
		There is a certain level of chaos that is subjective | henry
		A torrent of thoughts shall drown us all, in the end | henry
		Things are, in fact, as they seem | henry
		What's it like to be &alive& alive? | wes
		The end of the road away from confusion is where you break | henry
		Silently selected, washed, and reincarnated | tom
		You can cleanse yourself any day you like and however you like | tom
		One day you will realize the ability you possess | tom
		The vistas with snow-covered trees, and the sun reflecting off snow crystals to create brilliant, shining obelisks of light | tom
		Snow does contribute a certain surreal beauty to this world | henry
		Femtoseconds away from ending the love of your life | henry
		&Thinking& doesn't bend the spoon | tom
		Relax your mind | tom
		Friendship looks golden in the pale moonlight | henry
		The contrast of the grey clouds and the blue sky gives clarity and luster to entities nearby | tom
		Just because you see someone else's reflection in the mirror, doesn't mean it will last | henry
		Our shadows are bookmarks the universe leaves to remember where she put us | molly
		Missing a distinct opportunity is either a sign of resignation, contentment, or idiocy | tom
		Bow to the universe | henry
		Uncharacteristically established in your place in the universe | tom
		Try and arrange your thoughts in circles (the chances are higher that way) | henry
		It's just us | henry
		They should all just be silhouettes doing various things | hyacinth
		Paper-free soul | tom
	`),
	//suffering
	new Scroll("Suffering", `
		You're so happy! You're so relieved you're not dead | AI
		I will be with you the day you die, that day is now | tom
		We hope that you find comfort in the fact that you have the capacity to move around and think | tom
		Improvement is inevitable | henry
		We will never become better, but we will do better | AI
		Sacrifice the bean | sofia
		It's almost funny how many there are, if it wasn't so searing | tom
		Every action that you take counts towards your punishment | tom
		Typing, typing. They've been typing for the longest time and I can't wait any longer | tom
		Copying block after block after block / When will it be built? | hyacinth
		Killing them won't help your condition | tom
		Helping your condition won't kill them  | henry
		Would you like to experience having your limbs removed? | henry
		It's markedly unpleasant to spend this much time out there | henry
		Do your best to stay outside | henry
		The bugs are screaming | henry
		Your skin is begging to break free | henry
		The air cuts deep into the scars in your skull | henry
		Screaming through the holes in the wall | henry
		It hurts to stop screaming | henry
		No please stop it oh no not the &chin& | henry
		Rolling down a hill with tragedy at the bottom, debating the merits of existentialism | henry
		Rest quickly and with ease | tom
		That's when they eliminated your home | henry
		Half of your soul is left, feel free to see yourself out | henry
		I hate what happens to that word for suggest when you make it a gerund (-ing) | henry
		My head is &rolling& down the stairs | henry
		Schools don't know that you &could& read | henry
		Regret tangles your time off this week | henry
		The distance is mesmerizing and difficult to win against | tom
		Here's your report / Where did you &get& this? | henry
		The lil' guy is bite | henry
		Biting through layers of artificial cartilage | henry
		Don't live by the nature of suffering | henry
		Don't forget your keys before leaving the house | declan
		Evil, evilness! / Terrible | forrest
		Encapsulated is the cri de coeur | tom
		A cacaphony of binder clips, shrill and inconsolable | molly
		Beating without the pulp | tom
		&Un-pinning joy from your quick access& | henry
		The lil' guy can't feel his toes | henry
		Captured and canned | molly
		(I am) filled with the dread on ten thousand twinkies | molly
		Can't you feel the pain of your dimension? | tom
		Now you know that pain has meaning | tom
		Truly bad situations | henry
		How are you this close?! | henry
		If held to skin for long enough, the fire won't hurt anymore | shannon
		Stressy depressy lemonzesty | mele
		Battered and boxed | tom
		Corduroy bananas | henry
		It's ok if you're getting ahead (You don't deserve a neck though) | henry
		Don't fear* the establishment | henry
		Hidden from those who descend | tom
		Nobody* calls me that | henry
		Hang on, we're contemplating retribution | molly
		Have some respect for the meter stick / You never know when your roles will switch | henry
		A claim this world is hell is subjectively truthful | tom
		You have stolen the free samples | henry
		Almost fast enough to reach the mailbox | henry
		There's always time to cry | sofia
		...pending execu...ebating consultation / try resetti... / ...t tearing...hurts | tom
		New pains records! | henry
		Everything is porous in some sense and dimension | tom	
		You could survive off less | tom
		Forced into recollection | henry
	`),
	//a good book, high tier proverbs, logic / thoughts
	new Scroll("Okrates", `
		&Nearly incomprehensible farmer accent& / Goddam spots in the harvesters again &spits& / Get the blowtorch and lure | tom
		Buying candles from a thrift store | henry
		Selling wax cylinders for unreasonable profit | tom
		Your friend has a large bag of colored disks | henry
		The human eye can divide into multiple sectors, one for each color | tom
		Beams of light: the things which sneak within | tom
		Lost in monotonality | tom
		Nothing compares to the excitement of opening a tree | henry
		Surges of unification | tom
		You have acquired salutations | tom
		To be free from any external and internal suffering is very, very difficult | AI
		If you hear them, do not touch 'em when you are hungry. Even if you touch them when the sun sets, this may seem strange | AI
		I can't feel the extremities of consciousness anymore | henry
		No better way than simple communication to reach our goals | henry
		Death is a myth | tom
		A semicircle indicates happiness and contentment | tom
		Once again, we begin | tom
		Praise to the ascended | tom
		Carving significance out of those you forgot | henry
		Passing thresholds in our minds | henry
		Ambiguous descriptions of everyday phenomena | henry
		Common sense is a plague that can only be destroyed by common logic | tobyn
		They're on the move | henry
		They are &rising& quickly | henry
		Assumption is the doorway to new ideas | tom
		Mankind is but a kernel of corn in the cob of truth | julian
		Losing a game of chance on the way to work | henry
		Slightly closer to false goals | henry
		A long way to go before you'll stand here steadily | henry
		Don't worry about it | tom
		So many words, so little meaning | tom
		Why do we &think& so poorly? | henry
		Organizing thoughts in a peculiar area | henry
		A hop, skip, and an interdimensional jump to conclusions | henry
		The power of the strange unity of soul, spirit, mind, and body | tom
		Your mind; a thought strainer | tom
		In a space deafeningly dark / Seek that which you will not find | henry
		Let's stay away from the truth and make our own | henry
		Specificity is acceptable but only in the abstract / I feel like that's the rule I was looking for but did not have | molly
		A repository for your thoughts and ideas / Kept safe from the storm | tom
		Retract that thought! That one. The one you thought of when I said "that one" | tobyn
		They are &always& vigilant / Not one of your thoughts will pass them by | hyacinth
		To add, but not to change | tom
		Such is the soul | tom
		That's about it | tom
		The makers are also subject to the ills they portray | tom
		Can't you see your eyes are lying to you? | tom
		The content of their character shifts depending on the device | henry		
	`),
	//you
	new Scroll("Isfaths", `
		You will be lucky / Turn to the sun and be fearless | tom
		You will be unlucky / Turn to the sun for its gracious mirth | tom
		You are lost | henry
		You are found | henry
		You are being searched for | henry
		You are the entire vehicle of change | tom
		The greatest thing is that you are now a human being | tom
		You must know ONE DAY YOU WILL BE HELD | tom
		There are a few moments of truth. Five have passed but you've only realized one | tom
		You do not hear evil | tom
		Several pieces of advice for you and mine | henry
		Your will to live contains a remarkable amount of embroidery | henry
		You are encompassed | henry
		You get to be here | henry
		You can't move &that& quickly here | henry
		I like how you remembered that | tom
		You've been hard at work | tom
		Enjoy your interactable labour | henry
		Test your system | henry
		You have been inflicted with the "end of days" | henry
		Why are you crying? Only &the worst& happened | henry
		You can't hear them skittering over the surface | henry
		Purple caps on empty heads | henry
		Contain your phony celebration | henry
		You have arrived at my destination | henry
		Don't look where you can't see | henry
		Of course you understand | tom
		"You" are alive | tom
		Become strategic when you can't | henry
		You have one* chance to learn this, and &you& aren't even paying attention | henry
		You look through the window bewildered | julian
		It can't hurt you | tom
		Despite you, I feel ᴇᴄsᴛᴀᴛɪᴄ | tom
		You are tantamount to the big picture | molly
		You're plainly very | tom
		A collection of cells, a collection of strands, and your unique being | tom
		Wait! That's not yours! | tom
	`),
	// its the title. its just hubris
	new Scroll("Hubris", `
		Sleep well. Nothing foreboding, it's not like you have only this last chance. Just... a good idea | tom
		The houses are only separated by colorful banners enscripted with avant garde medieval symbols | tom
		Control, down-shift, now park the car | tom
		The frugality of an onion is overrated | shannon
		The growing ball of dirt is simply a distraction | henry
		Do not concern yourself with them | henry
		To reach enlightenment, you must imbibe | henry
		To go on living life like this is as impossible as dying is | AI
		Weather predictors are false prophets, do not listen to their heresy | tom
		Happy dreams keep you happy in a dream job | AI
		An impressive drift-catch | tom
		I am familiar with the vibe from whence you arrived | henry
		You must be swollen | tom
		You don't want to stay out of sight for a while | henry
		They're probably fine | henry
		Don't feel shame when you fail, feel it when you succeed | henry
		Tiled bedroom for you and yours | henry
		Use an umbrella to keep rain out of your soul | henry
		Pitiful fractions and refractions of the shadows of doubts flicker across the minds of the human race. Only those holding their homes tight to their chests are delivered to comfort by fear | henry
		Time spent making up proverbs is a proverbial waste of time | alan
		Meatballs are strictly less painful than daggers | molly
		There's nothing in the pudding | henry
		It probably won't exceed the capacity of the known universe | henry
		Earth is unimportant but it doesn't matter | declan
		Although simple in principle, the process is difficult to unravel | tom
		Who's your least elevated character | tom
		Sanctity is the mnemonic device | tom
		Black is the new black | shannon
		Try visiting the amusemezall some time! | henry / wes / molly / zoë / max
		Trying on suits whilst being a ghost | henry
		Be afraid! | declan
		When we say rats, we don't really &mean& rats | henry
		This is not a fire hazard! / Nuh uh, totally not, just ignore the risk of fire | henry / forrest
		Tomato, potato. Who cares? | henry
		Damn I should've brought a flashlight | mayzie
		Don't look yourself in the eye | henry
		It can be dangerous to give flowers to all those who pass | henry
		Don't make gaps out of left | henry
		You know, like sauce of the brain | wesley
		What are you asking? / This is the question | declan / henry
		Stop looking so gruntled | henry
		The coating, though effective, is very unneccesary | tom
		I bet if we ran into that fence fast enough, we would go on an adventure | shannon
		Just cause it's on fire doesn't make it a &bad& destination | henry
		The world* is &exactly& what it seems | tom
		* "They," in this document, can be assumed to be only singular | hyacinth
		Pronounciation is strictly subjective | tom
		The title was composed of five adjectives and a single meaningless phrase | henry
		We &all& feel bad | henry
		We've got plenty of room | henry
		Don't trust the koala-headed man | tucker
	`),
	//animals and... bread?
	new Scroll("Dilap", `
		Cavehorses can't even walk around in mud | tom
		Peppers are toxic, perhaps | henry (t)
		Some rocks are healthy, actually | henry
		Bread was never an animal | declan
		They plead for toast | henry
		The birds will save you from yourself | henry
		The birds will be your downfall | henry
		The horses are here, they wish fortune upon you | henry
		Bird and primates sometimes have similar degrees of skill at aviation | henry
		From little acorns large octopi grow! | molly
		The pulverized seeds glisten in the flourescent light | henry
		Don't look at the barley | henry
		Raisins in deeply sorrowful locales | henry
		There is no horse on the water | rowan / tom
		Birds falling to the sea | henry
		All cats have the innate ability to become a chef | tom
		Tamedflowers and wolverines (they mean you no harm) | henry
		Wombats in the basement, climbing up, &up&, #up#! | henry
		Several geese in a sine wave | henry
		&Shhh! Don't tell! The hippopotamus is hollow& | molly
		The ants are listening | declan
		The answer: listening... | molly
		The zoo is expanding, far beyond its proper limits | henry
		Psst. Come hither candy. Would you like some children? | molly
		Do not operate heavy machinery while under the influence of willful iguanas | molly
		The clams have come unhinged. | molly
		A murmuration of antelope dazzled overhead | molly
		Barnacles: discuss. | molly
		Barnacles, discuss! | tom / molly
		O'erhead, the cuttlefish flying south for the winter... | molly
		Spoonfeed the cats for optimal maturation | wesley
		The dodo bird had always believed he had plot protection | molly
		Toast: truth or a good story? | molly
		The platypi left for a night on the town, and returned with opposable thumbs | molly
		Egg-laying mammals have increased use for pockets | henry
		Sheep do what they can't | henry / tom
		Ground up grains with a helping of pain | tom
		Wasps in the hive | henry
		Birds have windows to our souls | declan
	`),
	// mid - high tier proverbs in general and insanity, light
	new Scroll("Praculae", `
		A simple, everyday, all-consuming life routine | tom / AI
		Good insanity is necessary as it will leave no room for bad insanity | tom
		Insanity is just the eye of the storm | tom
		A crescendo on conscious always precedes madness | tom
		Cynicism is futile | tom
		Manners in a state of anarchy | henry
		So I've made up my mind now | tom
		We're only doing this if we all die | tom
		Almost to the end! / Let's not think about what happens next | henry
		You will need to wait a little longer | tom
		It never gets old. It doesn't need to | tom
		There is nothing left - not even the truth | AI
		The books within visible writing are the easiest to understand | tom
		An image is worth twice as much as a ten hundred words | tom
		You only get two first impressions | henry
		Droplets of heaven spill into the cave | henry
		We didn't know you could be this awake | henry
		We haven't slept | hyacinth
		you can't &still& be awake | tom
		You &know& how to sleep, right? | tom
		Feelings of another supercede feelings for another | henry
		Feelings of one intercept feelings of the other
		You create reality to prevent insanity | tom
		You create insanity to prevent reality | ryan
		I need to stop the madness and start putting my mind to rest | tom
		In identity phase II, you can spend an enormous amount of time and money to swap your best and worst days | henry
		Although different in many ways, affection and insanity are dueling twins | tom
		Where's he, late to sanity? | henry
		Fluidity of the soul | henry
		Who's knocking on my head at this time of night? | henry
		Running down walls | henry 
		Walking on Reque Road | tom			
		Decrepit and unsatisfactory weather | tom
		A fight between spirit, soul, and mind | tom
		We're all nervous | tom
		Various dents indicate your dedication | henry
		Au contraire! I am not a home for insanity! | tom / shannon
		Insanity brings greater comfort than clarity in a disaffected space | henry
		Filming the steps to insanity | henry
		My shadow is a demon, thirsting for my blood. / I first figured this out at age 13 and have been hiding in the darkness ever since. / If there's no light there's no shadow. If there's no shadow there's no demon. If there's no demon I stay alive. / Alive in darkness slowly going mad | mayzie 
		Retrorefractivity | henry
		Keep making the photosensitivity larger | henry
		&Completely& unreactive | tom
		It &hates& the blacklight | tom
		We are ever so close to our downfall / Let's get going then! | henry
		Creating instances of friends and family | henry
		A punctuation mark specifically for rhetorical questions | henry
		Threatening slashes / Rapidly approaching punctuation | henry / tom
		Periods for emphasis | henry
		Truly bizarre strings of characters, stored amongst the weather | henry			
		They're working together on the "project" | henry
		Decent, just decent?! That's it?! | forrest
		Poorly organized humans | henry
		We all &want& it, we just can't &have& it (obviously) | henry
		Common sense is whatever I want it to be | henry
		Everything out of order / Everything in space | henry
		Howling in an empty room / Where are the walls? | henry
		Revel in what you do not know | tom
		My brain spits out specifics like you wouldn't believe | molly
		It likes to highlight | tom
		Hasn't it ever crossed your mind | tom
		Good morning / Happy morning / Merry morning | henry
		You'll know it when you see it / Or you'll think you're going insane | hyacinth
		We've got something appropriate to fill in the gaps in your mind | henry
		Storm of your amber eyes | tom
		What? In blindness you can't see? | declan
		Thinking is terrifying / At least, that's what it wants you to think... | tobyn
		So all thoughts should be about not thinking, / so even if you happen to think you will only be able to think about not thinking, / which means the object of thinking will be lost in a flood of thinking about not thinking / and your thoughts won't be productive | tobyn
		Madness that isn't yours, despite your contribution | tom
		Low equality in nonsense contribution | henry
		Nearing consciousness / Fearing consciousness | henry
		Looking ever closer | henry
		He's unambiguously plural | hyacinth
		Invisible to any eye you can muster | tom
		You ought not to have a mind where your going | hyacinth
		You can feel that your mind is about to collapse at any time | hyacinth
		I'm going to put you in the Mind Room | tom
	`),
	// pleasant thoughts
	new Scroll("Ique", `
		The lil' guy has a delivery for you | henry
		The lil' guy's skull contains a celestial body | henry
		The lil' guy has an object | henry
		The lil' guy is unwinding | henry
		Chestnut-warm heart | tom
		This spot... the lil' guy is here right now and having a wonderful time | tom
		The lil' guy's future is looking up | henry
		The lil' guy's completely alright | henry
		Collections of memories, warm with nostalgia | henry
		Even across the distance, the warmth of community crackles in the cold | henry
		It's cozy here, far from the barren glow | henry
		It's done, you can breathe again | henry
		Your place will meet you when you least expect it | henry
		It's fuzzy here, your blanket snug between a rock and hard place | henry
		There's something here for you | henry
		The grain of the wood runs in the direction you'd expect | henry
		The lil' guy is instigating | henry
		From the top of my heart, I wish you good fortune | henry
		The lil' guy is &always& counting sheep, may he never rest | henry
		The lil' guy is borken | henry
		The lil' guy hasn't breathed since the last time he smiled (he has plenty of oxygen) | henry
		Embrace, and be held | tom
		The halls are so soft when you love them | henry
		Hey, hey. It's not a bad thing | tom
		The lil' guy is &done& waiting | henry
		The lil' guy will see you now | henry
		The lil' guy plans on verticality | henry
		A wrinkled piece of home | henry
		Freckles on your soul | henry
		Focus, don't worry. Everything is love and warmth | tom
		Many thanks regardless | henry
		The lil' guy is here for his apple juice / He needs a graham cracker to go with | henry / molly
		You have done that which &can& be forgiven | henry
		Asleep on a cylinder | henry
		The lil' guy's plum tuckered | molly
		The lil' guy is experiencing emotions | henry
		The lil' guy thinks the battery is going to eat his sheep | henry
		Look at the lil' guy! | henry
		Freckles on your heart have a neutral connotation | henry
		Despite everything, you're pretty much always still yourself | tom
		Resting in a quiet apocalypse | tom
		Spinning around on the way to the hound | henry
		The faceless sheep can see you. / They are also really cute | declan
		Just kinda dancing on the dashboard of a car | henry
		Decency glows underneath despite the dust | anna
		Sunny shiny sweet spun sugar | mayzie
		You are like a potato (we all grow) | julian
		Creating a tripping hazard (simply for the inevitable power?) | henry
		You'll be ready for what comes next | tom
		Joy on a blue day | hyacinth
		Feeling fluffy on a friday | henry
		They are &bounce& | sofia
		Contain the child | william
		Sprinkling my home with light | tom
		Letting the others keep the time | tom
		An unending sequence of silent screams | henry
		The lil' guy is waterlogged | henry
		A ˢᵐᵃˡˡ ᵏⁿᵒᶜᵏᶦⁿᵍ at the entrance | henry
		Inopportune romance | henry
		Capital me and lowercase me | henry
		The chilling breeze reminds you of home | tom
		The sunset reminds you of comfort... | tom
	`),
	// in the title
	new Scroll("Unpleasant Thoughts", `
		Carpeted windows | tom
		Guitar of vocal cords | tom
		Don't build an atom bomb with teeth | rowan
		The fan companies have a plan | tom
		Stop voting at all, you're a fool | tom
		The potatoes are watching, the corn is listening, and the grapes are feeling your skin. Right now | henry
		A hundred and one thousand days, which they want to get rid of, but they do not | AI
		There's an old gentleman inside the house. Currently / The old woman is later, don't worry | tom
		The phone is out of range | henry
		A breath of fresh air | tom
		It's getting uncomfortably close | henry
		Your teeth &sure are malleable& | henry
		You'll never be awake | tom
		Give back what you took, so I don't lose them both | henry
		If you get too close to your friends you will &#experience#& | henry
		Teeth under your skin, rising | henry
		Dusty, porous faces | henry
		Some more, dusty | henry
		Holes in the floor (by design) | henry
		You do realize these aren't &actual& newlines right? | henry
		If you consider your thoughts, will you find that dramatic and unbearable change will be required to rid yourself of the things you enjoy? / Occasionally, actions are imbued with positivity soley by ceasing to reason | henry
		I'm going to add another case | tom
		The pages of the book are deceiving in length, but surprising well priced | tom
		Contribution feeds that within you which should starve | henry
		Cartilaginous head handles | molly
		The craft is insufficient | tom
		Number of fingers is an appropriate basis for a hierarchical society | tom
		To much teamwork corrupts the mind | henry
		Collaboration for the greater bad | henry
		Decidedly unappetizing drywall | henry
		Feeling your neurons swell | henry
		Yelling at the bottom of your lungs | henry
		Vitamins in the skin | henry
		You guys know my longstanding antipathy towards mayonnaise | molly		
		The wiring in the walls goes unused, just like before | tom
		It all falls apart when exposed to insulation | henry
		You just wish a couple more disasters would find their way in front of you | henry
		Too fuzzy to be sticky above most circumstances | henry		
		Some people panic when they hear this, / but the truth is... | henry
		Helpless in opportunity | henry
		Salmon: Engage your landing gear (somber) | molly
		Popcorn filled pillows (tired) | tom
		Dehumanization is "ok" on Thursdays | henry
		The lil' guy is feeling ominous | henry
		Ham* loaf for fifty-one | molly
		Conducting a poll: head, shoulders, knees, or toes? | molly
		Cracked, shriveling fingers | tom
		Boiling vats of kidneys | henry
		It's like warmth, but it isn't | tom / shannon
		Hope in the drain | henry
		Cheese grater for the soul | henry
		Every thought you have you lose a hair | tom
		Two minds completely make up for your lack of a body... | henry
		Two bodies do not make up for your lack of a mind... | tom
		An unbeating, atrophied face | tom
		Frogs in the throats | henry
		We're out of air | henry
		They are &in the house& | hyacinth
		Phantoms in your clothes | henry
	`),
	// what does this ***mean***, business
	new Scroll("Sputilations", `
		Mass production companies of tether cords are being overrun by small scale, local businesses producing tether cords | tom
		No soul, no service | henry
		We only sell #solid# plinths | tom
		The containers keep on costing greater amounts | henry
		Last edit was a bit ago and you don't know what it was | tom
		A new random object has been added to your living room aesthetic | tom
		A new random object has been removed from your living groom aesthetic | henry
		Your own mind always seems to bend | tom
		The world is an illusion and never will be / Everything is impossible | tom
		There is no do but try | tom / unknown
		Try, there isn't a do | unknown / tom
		The weather must be treated carefully, its quite slippery | tom
		There is something inside of out | tom
		The electrical cords are grinning broadly | henry
		If you don't evacuate your network, what can you expect to gain? | henry
		We may be in business | tom
		Sir Bones and the Temple of Temperature | tom
		And gotten a business license in my name / and taken over the world | henry
		I can pay you in &#constancy#& | henry
		Ostriches make &great& vacuum salesmen! &shh sh sh sh sh, just trust me on this one& | henry
		Door locks are the career to good business | tom
		Several dimes for your time | henry
		A few &run o' the mill& injuries | tom
		More information may be found in the walls | henry
		It's fluffy here in the place I should be trying to leave | henry		
		It hurts more to know &how& to fix something | henry		
		The surface of the ocean you're drowning in is just more oil! &You& can't breath | henry
		Crop circles encoded into your genes | tom
		Crop circles encoded into your jeans | tom
		Resignnation? No, please, re-sign this paper | tom
		Signing off your doom | tom
		Cents, it happened | tom
		The capital owners love puppies | declan
		Trustworthy lawyers, planning on helping* you win your case! | henry
		Terms of the contemporary | henry
		Breathing is &not& OK in this establishment | henry
		You're full of promise | henry
		You're full of contracts | henry
		Getting used to catastrophic inputs can be uncomfortable in hindsight | henry	
		Fresh baked sand. Right out the oven. For &free& | tom	
		How about &this& deal? | tom	
		The payment depends on the quality | tom		
		The Company is losing its battles | tom
		Making money by restricting soap supply | tom
		Having hair is a sign of status | henry
		We'll take your false idols | henry
		They've got &unlimited& stock | henry
		$1.⁵⁷ worth in severe damages | tom
		Wheat is the only product which produced &real& value | henry
		Who's removing the shops | henry
		It doesn't give off the gleeful sturdiness of &real& iron | tom
		Salvation* costs more than you may expect | tom
		A gradual recompense for "home" | tom
		Three offers, not pending | henry
		The heavens are bankrupt / They're liquidating the stars to balance the debt | molly
		A slight uptick in shoes | tom
		Ooh I can get a formless body? | tom
		Not even $3, more like a dime | hyacinth
		We only sell / We never buy | hyacinth
		Now &that's& something | tom
	`),
	// honest stuff, no funny business
	new Scroll("Ti", `
		The blind man knows, the deaf man speaks, but the wise man can only hear | tom
		An eye for an eye makes the whole world able to hear better | tom
		Reality is not about you | tom
		Reality is purely you | tom
		Reality is a lie | tom
		Elements of the being: Soul, Spirit, Mind, Body, and Bone | tom / henry
		Rumbling in the soul | tom
		Shattering of the bone | henry
		Division of the body | tom
		Quenching of the spirit | tom
		Twisting of the mind | henry
		Realer than should be possible | tom
		To live without being distracted | tom
		I do not know from whence I speak | henry
		The future you've seen is real / It has been there since after all | AI
		Let yourself admit it | henry
		Don't fear the immediate | henry
		Don't add to things you wish were gone | henry
		Medium sized lighting and numerous blankets makes for a comfortable evening | tom
		Such is existence | tom
		With hope, and belief in oneself | henry
		You are covered in bindings and strings | tom
		A burgling most shameful, wrought in daylight | henry
		If I had a dollar for every good deed I've done, I'd have several dollars by now | alan
		Writing partially disparaging remarks leads to a lottery of first impressions | henry
		Similar pain for disimilar people. / Is grouping by this really advisable? | henry
		Portions of recollection, even organized by perceived significance, will always degrade eventually | henry
		Speak well enough, and you may get an education / speak poorly enough, and your words will have worth to the crowds | henry
		There's worlds beyond these | tom
		Stop fighting the nature of your goals | henry
		Break down the barriers that keep you from making your greatest mistakes | henry
		Only feel bad around others | henry
		Don't justify their actions | henry
		The octopus twiddled his tentacles as the world dashed madly on | molly
		Everything is where it is | julian
		Discovering those within your soul | henry
		So old you're past "age" | tom
		Too young to use "stupid" | tom
		Pure thoughts: no thoughts | henry
		Like an anchor keeping me from floating away | mayzie
		Stubbing toes in the sandbox of life | tom
		Failure and winning are linked. To win you must first fail | mayzie
		Circumspect intentions lead to winding executions | henry
		There's two devils inside every one of us | tom
		Advice for morally decrepit | henry
		None of the cool things are easy | henry
		Your knowledge is yours, although it may change without your will | tom
		On a sinking ship, given the choice between a first class suite and a lifeboat, you chose the former | henry
		Feels like rooms in an infinite mansion... is there an outdoors? | tom
		Almost always if the answer is genuinely yes | molly
		If you lie well enough, disguise in unneeded | henry
		The best line's from a book no one's read | hyacinth
		Maybe I need to think outside real life | tom
		You can only go there 2 or 3 times before you can't leave | henry
		One or two strands of our minds connect us to others | tom
		It is central to your own philosophy | tom
		People need to see dead ends for themselves | tom
		You need to slow down | hyacinth
		But, in a way, that explains nothing | hyacinth
	`),
	//death, cycles, circles, birth, rebirth
	new Scroll("Circles of Polarity", `
		Am I dead? | tom
		We don't believe in death | tom
		I am alive again. The sun has come full circle ... and now I am standing in a sun-flicker... | AI
		You would prefer to be cautious of death | AI
		Fairy Tales and the Death of Humankind | tom / AI
		Concision and the Art of Knives | henry
		Rite of Idleness and the Fun Time | tom
		Run away, you won't end up where you started. Ever | henry
		Run away, as slowly as you can bear | henry
		The end of the world at the doorstep and Ij'o wept tears of posterity to be alive and selected | tom
		Nothing left but ash and real life | tom
		Running in threes | tom
		What? Did I think of something? | henry
		Watches are the hands of eternity | tom
		Hues keep on rotating until they die | tom
		Only you can determine, I will tell them in the order they came to me | molly
		Nobody except you knows your location, geographically and possibly in some other way if you see the metaphor in this | tom
		Trust me officer, no laws, physical or otherwise, were broken | henry
		&wish you were here& | tom
		You struggle to sleep during soul storms | henry
		It's not a &bad& thing, at least on how &we& view death | tom
		If it appears dead, inside it's more alive than ever | tom
		I can &feel& again | henry
		Dying isn't an effective method of transportation | tom
		And I die, again, c'est la vie | tom
		Walking in the circle, I found the end | anna
		Hallelujah! The cataclysm's closed. "Gone fishing," the sign said | molly
		Somewhere between hither and thither | molly
		Faint scratches of strange minerals upon the corpses of our ancestors | henry
		What style of... gravestone? | tom
		The line between life and death is pretty thick. / Still, you walk it with a high chance of falling | tom
		Don't place bets on your death | henry
		Dawning on the cycle of life and death | tom
		Do &you& remember your birth? | tom
		Study your own life and times / Memorize important dates / they'll come in handy later | tom
		The circle is complete | tom
		The fruit of running | tom
		You can't &still& be running | hyacinth
		Born into a life without chances | tom
		Prepare to be born | hyacinth
		Death, a simple illusion. Life, an abstraction
	`),
	// ectermine! classics here too
	new Scroll("Ectermine's Legacy", `
		It's done. All the doctors are dead. Apples are no longer necessary | tom
		An apple a day keeps the doctor away. Ten will send them flying | henry
		The apple counter is non-zero. #&Panic&# | henry
		Misanthrope? More like miso soup! | henry
		There's nothing here for you | henry
		Don't even try | henry
		All hope is lost | henry			
		Need be has been | tom
		The eyes which await you in the void only want your mangoes, nothing more | henry   
		Molasses that should be eaten | tom
		Have you checked upon it recently? | tom
		I'm going to become extremely ethical tomorrow | molly
		There will never again be a house | tom
		The shards are horrifying | tom
		The shards on the walls make it feel claustrophobic | henry
		(This post will not be written with any intention of making you work at the post as I am an ex-gale worker) | AI
		Don't abandon your post... yet | henry
		(It was all resolved) | molly
		Glutenfree Genderfluid Girlfriend | henry
		Glutenfree Genderfriend Girlfluid | henry
		Glutenfluid Genderfree Girlfriend | henry
		Glutenfluid Genderfriend Girlfree | henry
		Glutenfriend Genderfree Girlfluid | henry
		Glutenfriend Genderfluid Girlfree | henry
		My head is full of names | hyacinth
		Not a single one of the plans ends well | henry
		The cooks are in the kitchen | tom
		The cooks are in your living room | tom
		The cooks are in the restroom currently. Give them sufficient time | tom
		Glaciers on the move will encourage your personal growth | henry
		Better than the rest of them | henry
		Trans Hunds goeth fast | henry
		Although small, the percentage of Vitamin C in the atmosphere was unreasonable and unmoderated | tom
		Feeling french on a friday afternoon | henry
		The foreshadows get longer at noon | henry
		ɪn the space you call home / 'til the day rings true / ᴍy knights, they arrive / ɢarish and blue / ᴇnding the lines / ɴear to the brink / ᴅefeating the darkness / ᴇrased in a blink / ʀevealing the brightness / ғull of esteem / ʟeading the faithless / ᴜnder the steam / ɪn poor situation, we find ourselves here / ᴅecrepit and empty, lost amidst fear | hyacinth
		Then she gave up / Then he gave up / Then they gave up / Then it was done | henry
	`),
	// short things, doors
	new Scroll("Spaoons", `
		Don't tap the keyboard twice | tom
		Suburban, urban, hyperurban | tom
		The rurals are the main source of the urbs | tom
		Subavocado | tom
		Visual mode engaged | tom
		Kanye's Game of Life | lucca
		They approach | henry
		You thought!!! | tom
		#Who# would have thought?! | henry
		Chopped calcium: serves plenty | henry
		Human arms: part of a balanced breakfast! | henry
		Fun fact: doors are not guaranteed to be associative | henry
		The handles of one-way doors are dusted with regret | henry
		Containers for the heart: rib cages, love, greeting cards, etc. | henry
		The escape hatch is often easier to use than the door | henry
		The shortport is | tom
		Climb the pole | tom
		Living vexatiously | tom
		Lie to them | tom
		Don't lie to children | henry
		Lie to children | henry
		Children, for the purpose of mistruthing towards | tom
		Maul but smite-y | molly
		Labs were fun | tom
		Most wrong answers | henry
		Who's ready!? | henry
		Just talk | tom
		Take that!?! | tom
		Wooo /    ooo /       ooo | tom
		In the house! | tom
		Why haven't &you&?! | henry
		Wholly unusual fiends | henry
		They go &that& fast?! | tom
		Gathered from what?! | tom
		Dark radiation | henry
		Confounds abound | molly
		Remain unsatiated | tom
		Chonky margins | henry
		Ever-slimmer margins | henry
		Iiiiiiiiiiiiiiiiiiiit's suppertime! | henry
		Water hazard | tom
		Converb (antonym) | molly
		Dessert: the dominant paradigm | molly
		Guess what? #&ɴᴜʟʟ&# | henry
		Doors are Doors / Keys are Keys / Locks bow on their knees | declan
		Doors don't have knobs, at least they don't need to. There doesn't even need to be an opening | tom
		Particular peculiarity | hyacinth
	`),
	// apathy and surrealism and longer, story-like ones
	new Scroll("Apathetium", `
		Surreal continents continue | tom
		Meteor, across the dimmed landscape | tom
		An amber lamp for you in this paling room | tom
		Intangibility in the palm of your hand | tom
		Tattered paper documents, drifting over the road at night | henry
		You &love& your coworkers | tom
		Absolute nothing! &echoes& | tom
		They have all the same memories of the day | AI
		Behold upon the pit of ash and thou shall fall into luminance | tom
		If I was going to be gone forever, I'd bring my 3DS with me | max
		Do your best before it's gone | tom			
		Visit them every once and a while | henry
		It is not certain that we'll find anyone there | henry
		The asphalt burns as you step towards the dim glow. If only they could send someone else | henry
		We all belong in low saturation rooms, our consciousness and silhouettes providing the only details | henry
		You can't even see the peeling paint or tattered lamps anymore, just the imprint of your warmth | henry
		In the final stages, you may feel immense nostalgia (often to an unprecedented degree) / What you do is your choice and yours alone | tom
		Fog so thick that you can create anything, in pure daylight | tom
		You rarely recognize the things closest or furthest from you | henry
		You rarely recognize anything | henry
		We could just apply a grayscale filter to our memories, and it would have the same effect | henry
		The combination of incredible cold, dry air must've worked just right | tom
		An empty pit to fill the lack of emotion | tom
		Divorce papers filed in an amber room | henry
		And the paladin stared across the grassland and across your soul | tom
		So many have matched the power vested within the silver coast | henry
		You &can& outrun your past with good enough shoes | henry
		Comforting insulation, at least. You can't feel the warmth as the walls are too thick | tom
		Damp literature in a burning building | henry
		Disinterest and an unoriginal quarry | tom
		The crinkling photographs showed their paling faces on the wooden table, from underneath various candles and buttons. Now the work is done | tom
		Writing on a sunburnt plateau | henry
		The tall grass in the field obscures your destination | henry
		Her legs were as long as a redwood, and her head looked as if it might touch the clouds | mayzie
		Mildly unhappy people flood the offices | henry
		They're on the mountain | tom
		Surreal and unusual, referencing things not from our world | henry
		Can't trust them, now can you | henry
		Gaps in expensive objects | henry
		A slight victory for the slugs | henry
		Two left for the end, to be seen again | henry
		A plethora of ways to walk over it | henry
		Drip drip dripping down the vortex of vacant vapors | mayzie
		The widgets were fraught with derring-do | molly
		Forever awake, you lie alone / Repeating the chants of ice and bone | henry
		Illustrious compositions in empty halls / Intricate literature on empty shelves / Shattered minds in comfort | henry
		Glowing with a rich orange light / Contrasting with the fleeing masses | henry
		The pure inconvenience of recollection | tom 
		The schoolyard is empty, empty of those you forgot | henry
		As the ground split apart and the spines emerged, you simply sat there, somber | henry
		Decrepit are they who host the night | henry
		Paom across the hill | henry
		Praising the broken lamps and the cracked gutters | tom
		A vast parking lot spanning across the nighttime desert | tom
		Paom's waywardness led to the revolution which resulted in citizens having more choice in their deaths | tom
		It has been taken / It has an obvious destination | hyacinth
		An amber glow crests the mountainside | henry
		More emptiness | henry
		Alone in the room | henry
		The room &isn't& empty | henry
		The search continues | tom
		Speckled sunlight and warm glow and a long wrought iron archway / it is here whic... | tom
		Your portrait stares back at you in this empty abode | tom
		A hilly, grass coated place | tom
		Venture into the plateau, I guess | hyacinth
		Doubled over in a speckled field | hyacinth
		Spheres amidst the cornfield / grey, smooth, unmoving | tom
	`),
	// time, etc
	new Scroll("Plagiarized Optics", `
		Why can't I understand clocks? | tom
		Knocking on clocks | tom
		The past is substantially more relevant to this recipe | henry		 
		Don't undo your companions | henry 
		Practice running, it'll make you more &dextrous& | henry
		Don't start with that | henry
		Only talk of the end will be sustainable | henry
		That wasn't even selfless and it pained you! | henry		
		Wobble like there's no tomorrow | molly
		You'd see others in the distance | tom
		What is the time and why does it chase me so? | tom
		A watch that actually works | tom
		Half eaten dreams | henry
		Seconds away from a deep concern with oneself | henry
		It won't have been that good, trust me | henry
		Negotiating with relativity | tom
		There are tunnels | tom
		Your multiple tongues | tom
		Notice / Time is running out | julian
		Time is but a laptop on a train | julian
		So much time but so little to be | henry
		That hadn't happened in this timeline, nor was it expected to | tom
		Only 33 more years | henry
		Just wait a little shorter | henry
		Throwing relativity out #it#'s window | henry
		Early and late are, while similar in principle, swinging twins | tom
		Early and nipore are battling demons | tom
		Don't feel when it's late | henry
		Don't feel when it's early | henry
		We only invent things to the #left# of our time | henry
		The months will be changed every 100 years | tom
		Returning from the present | henry
		If you do it at the same time, you'll destroy the entire concept of the process! You &have& to do it sequentially | henry
		Backing up the world to last Wednesday | tom
		Time is flying off the shelves | henry
		Temporally obese | henry
		Trapped in infinity | tom
		You'll be able to do it in less than 2 minutes | tom
		It's easy to see what you've done wrong before you've messed up | henry
		Many hours for falling towers | henry
		Reflecting your past | henry
		We all do it time and time again | tom
		They can't just in waiting in &all that time& | henry
		You will be exacerbated over time | henry
		Time flies, but then so does a duck | alan
		They won't be permitted for &some time& | henry
		The letters close at noon | henry
		Warm in your time | tom
		The pamphlets list expired dates in timestamps barely still valid | tom
	`),
	// violent unity. the whole gang is together
	new Scroll("Konradism", `
		They are up in arms | tom
		The belldrum is full of all the things we won't have time to know | tom
		Strike by the cover of the book | tom
		Become the anvil | tom
		The strong hand sends a heavy message | tom
		Leaves crumbing to sand in the clenched fist | tom
		Banish from our cradle the idea of violent unity | tom
		Houses on the summit of a mountain | tom
		It will end more vigorously than it began | henry
		It will end slowly, painfully, more mildly than it began | henry
		Keep fighting against the system | tom
		The webs hold their corpses | henry
		They must be enraged by the fissure | tom
		A &real& patriot will know what's best | tom
		And they suffered past twelve storms and the sharpenings of the Illuminating | tom
		The sturdy are walls for the strong | tom
		We're fighting against a machine we created a purpose for | tom	
		We don't &actually& divide them | henry
		The Aplotris Soldiers stood as vanguard against the sharpness, their minds hardened by kin and storm | tom
		We aren't the ones who defend the Continent. They are | tom
		Your name reeks of vengeance | henry
		Definite voids are only for the upper class | henry
		Tactically placed voids | henry
		We weren't firing on any cylinders | henry
		Assume violence | henry
		Don't betray your alliance | henry
		The nom de guerre given to the Headknight was "Ornamental Cabbage." The war effort tripled | tom
		A shocking amount of empty slots | henry
		The Judges are present | tom
		Knights at the top of a hill, debating the philisophical merits of war | henry
		Dulling your knife to use as a blunt weapon | tom
		The first can decapitate with one motion. / The second requires two motions, however, there will be &zero& bloodflow and thus no mess | tom
		Scoring for &the& enemy | henry
		The message had been delivered: vibrant, vitriolic, and vile | henry
		An invasion of morals, as opposed to an invasion of armies | tom
		Not to blame, but to accuse | tom
		Divide them, or be forced to | tom
		Oh. Well. Of course they don't know what to say | tom
		Speed-based victory | tom
		Pandemonium struck (Shots were fired) | molly
		Strategically placed eyes | tom
		Don't let them tell you what (or what not) to "do" | henry
		Hope wrought of iron and blood | henry
		The competitor who is able to get eighth, ninth, and tenth should take the glory | tobyn
		Woeful tacticians are flooding the armory | henry
		Postponing the war | tom
		We normally operate &outside& of the standard protocol / Today we join the commoners / Tomorrow we fight! | henry
		Virtually indistinguishable from freedom | henry
		Kindling the revolt / &There they go& | henry
		We only train &enemy& warriors | hyacinth
		Spin around and point / There you will find your place | hyacinth
		Seats at the table (symbolically) | henry
		Invert the dominant paradigm | molly
		Convert the dominant paradigm | molly
		Revert the dominant paradigm | molly
		Another change / a revolution / against Entroepi | tom
		Another line has been crossed | tom
		Another army is needed | tom
		Beg to agree | tom
		Your enemy knows you. Where you live. What you ate for breakfast. Your deepest and darkest secrets. The color of your eyes | tom
		We all stay if horderves are offered / We can't promise our loyalty | henry
		Laugh at the line of your superiors | henry
		This was not founded in the spirit of competition | tom
		Delivering mail &can& make you an enemy of the state | henry
		Steelclad tentacles slamming against your will (as well as the hull of the warvessel you occupy) | tom
		Soul or strong spirit is needed to be "alive" | tom
		Any action you take shall be documented | sofia
		Punching in the afterlight | henry
		The burning sensation reminds you it's not yours | henry
		Above! There it is! | julian
		An impromptu show to force | tom
		Oh they fought / They fought til the borders cracked / and the knot snapped. / But then our soldier / got stabbed in the back | tom
		Surround the rising humans | tom
		I want to be on the safest possible side | henry
		Supporting the crews / Eluding the views | henry
		Tell them to divide and conquer so you only need to destroy small, shattered groups | tom
		They appeared to my woe-trodden eyes | hyacinth
		She is &on guard& | tom
		Keep it on the down up | tom
		You can't kill those ones | tom
		They are in &lock-step& | hyacinth
		Despise that which is required of you | henry
		Fading out of line | hyacinth
		Step by step guide to winning a tickle war of attrition | rowan
	`),
	//ahhahahhah jokes!!
	new Scroll("Varying Elements", `
		When is a crab not a crustacean? Whenever the train reaches the station! | AI
		When is a dog not a bison? When a sheep not a horse? When a pig, a pig's tail, a pig's head! | AI
		What does the old day say? The day of the sun! | AI
		Why does the egg contain a seed? It tastes better! | AI
		What is there in black glass? Something shiny, a like glass or liquid! | AI
		What color are the stars of Jupiter and Saturn? Tears of war | AI
		Where are the old trees? We'll never know | AI
		Wait. How many ribs did you say I have currently inside me?! | tom
		Why are #my# organs making &so much noise&?!? | henry
		The undulations feed your despair | henry
		Roads are imaginary | tom
		The frugal will pay | henry
		Agreed much, i just thought it would be fun for a few | tom
		They seek friendship, why would they be so foolish | henry
		You don't get the refractions until &next& week | henry
		I've been taking my new prescription. I really wish doc would've told me about the strings! / &muffled laughter of a comedy routine, at a joke you can't seem to understand& | tom
		Wooooooooo! Sig-ni-fi-cance! | tom
		UV resistant adenine!? What an idea! &chuckles& | henry
		How many days does Alice need raisins? Fear out of Jive! | tom / henry
		Why's the hair on &your& head? Death is a false positive! | henry / tom
		My ears are begging for me to stop giving them coffee (quiet you guys! #(:# ) | henry
		Quid pro sapientia - at what price knowledge? | wes
		Universal Lutefisk - fish for everyone! | wes
		Just forget about having a good memory | alan
		When is the sun not above our heads? When it approaches! | tom / shannon
		Doubles as a surreal nightmare! | molly
		Nostrils for knuckles or knuckes for nostrils? | molly
		A misconception falls down a hole into two dreary ravines. / The rabbit says, "What's the time?" / We all say, "Tomorrow!" | tom / henry
		Hopelessly apocalyptic, but bound to be better by Tuesday! | molly
		Entirely undone by shenanigans, the dachshund bid adieu | molly
		Life is like a carosel, vomit inducing | shannon
		Takes out two stones with a ˢᶦⁿᵍᵘˡᵃʳ bird | tom
		Let's make the last ones be truly &excerional& | tom
	`),
	// TV and media. very good proverbs here
	new Scroll("Vocaloid", `
		There's a possibility the people from TV are from the best of both worlds | AI
		Achieve points every time! | tom
		The television is full of ""gala appels"" | tom
		Come, join the show | tom
		We're being watched and that's why our lives are so much happier | AI
		They watch and because of that you leave | tom
		Monster. Look at yourself, and despair | tom
		Hi you, pitiable creature | molly
		You are tired, tired of having to wait 20 minutes to go in front of a big tv show | AI
		Sitcom idea where it goes on for nine season and everybody loves the amicable characters, goofy gimmicks, and adorable romances / After a few years of this, end the show with all the characters dying in tragic manners and watch the chaos unfold | tom
		Our lives! Turned upside down in no time! Free warranty! | tom
		Our priests work #round the clock# | tom
		You will not enter {#heaven.#} | tom
		Sitting in a counter, staring at the customers | tom
		We will be going into the restaurant \\& watching people talk when they sit down | AI
		There's one last great show for everyone | AI
		Happy TV viewing, happy family | AI
		Good morning / Happy morning / Merry morning | henry
		I hope you enjoy, enjoy the show of the same name! | AI
		Please have fun with this world and get together with your children, lovers, and family in this life long journey | AI
		Media in your lymph nodes | henry
		If you wish, we could &all& call instead | henry
		The crowd loves it when you do that | tom
		Wow! I wish &I& could cry! | henry
		Greeting cards for the undead, 30% off! | henry
		Technicolor bones | henry
		Fully emotionally stable! As seen on TV! | henry
		Side effects may include a distinct lack of purpose | henry
		#Upgrades#; people, am I right? | henry
		Now we have the whole $12.⁰⁰ to execute on them | henry
		Your doom, for only $19.⁹⁹! | henry
		These days, we squish bugs for &fun&? | henry
		Wow! the ceiling is really small, doc! Doc? | henry
		Achieve no points ever again. The game's over | henry
		New methods of expressing one's grief were released today | henry
		Want a fortune? The line before this says it all! | tom
		Low temporal resolution on daily activities can help improve performance | henry
		Soul crushing truths with a money back guarantee | henry
		Taking a loan like there won't be a weekend | tom
		Don't let the #spirit of system# infiltrate &your& lifestyle | henry
		Hey you! Why don't you try this on for size? | tom
		Have a moment? Try reconsidering your basic assumptions about the universe! | henry
		Losing a game which can't be won | henry
		Winning a game you simply aren't playing | henry
		Intergalactic couch entertainment | henry
		Emotional stability limit reached; please insert a quarter | shannon
		Lights! Camera! Inaction and a general sense of lethargy | henry
		Socially incompetent on live TV | henry
		Reach your audience, trace them, and consume them | tom
		The spectators are &stunned& | tom
		No soul, &service& | tom
		No shirt, no shoes, no mind to peruse | tom
		The ineluctable mystery of plaid | molly
		Donate to a lost cause! | henry
		...but is it telemarketable? | tom
		A website is only as strong as the weakest link | tom
		We only recruit basketball players (for the technology) | henry
		They watch and, occasionally, applaud | tom
		Undeniable results evvvvvvvery time! | tom
		&extra&. Know all about it | tom
		100% recycled souls | molly
		100% organic souls | henry
		I do so &love& "acrostics" (see below) | hyacinth
		It's like an endless soup bowl but with our lives | henry	
		Join us next* week when we do something awful! | henry
		Now &those& are some vital signs | tom
		Excited to exist today | henry
		Believe me they're &comfortable& | henry
		The premium state comes with +1 eyes. Do you have it already? | tom
		&Super awesome at menial tasks!& | henry
		He's always looking towards the camera | henry
		A well delivered scream | henry
		Special characters denote &true& seriousness | henry
		Disingenuous shock (experience) | henry
		Do we want more or less points? | bodie
		Every surface in the theater is &drenched& | tom
		Woefully applauding, they left in tears | tom
		The fans are aggravated | hyacinth
		There's no "k" in display! | declan
	`),
	// math, numbers
	new Scroll("Frill Optanal", `
		Persimmons are sufficient to sustain life | henry
		Persimmons are sufficient to sustain transportation | henry
		Persimmons are sufficient | henry
		The distinction between you and me is only 1% greater than ~99.099% of the distinction between you and me | henry
		Rolling a coin 10 times will not result in 10% spades | tom
		It is gone now, you won't need to fear for about another 38 months | henry
		If every event in a collection were a result of an enumeration to which it is not a result, / and that enumeration is only a sum of numbers where some element does not exist on it, and that the enumeration of the elements is only a sum (or sum) of numbers where some element exist on the collection, / we will have all the general forms of functions from which there is no natural law (unless the particular form is logically equivalent to the general form) / and the natural laws will be determined as the natural law of the universe would be | AI
		Five score, to the tenth. Business as usual | tom
		I've been adding cubes for about four minutes | shannon
		The air is warm for almost 30 minutes | tom
		A dog is not a feather, but a brick  | tom
		Gambling away across the entire range (it's about 40 or so meters) | tom
		Cozy vs. safe has a depressingly low r² | henry
		There are no guarantees that there aren't piecewise laws of physics | henry
		Weight is dependant on many more things than we thought | tom
		To sufficiently enjoy photons, take a break from them for a while | henry
		Alcohol is optional when in the presence of statistically impossible cacao | henry
		Taking derivatives, alone in a room | henry
		Base 1.89 | tom
		We're just gonna end up going back to the 3.5 | tom
		Column numbers in strange contexts | henry
		Tree limb to bird ratio | tom
		860! We're almost done fabricating nonsense | henry
		Stop thinking you're more special than anyone else. Infinity isn't larger than infinity | tobyn
		Angular velocity &never& caps out, unlike special or quantum velocity | tom
		A top-down view of the infinite | tom
		A highly unreasonable quantity of hands to be found in 1-2 cereal boxes (at most 5 would be fine!) | henry
		A bottom up view of the finite | henry
		We may have doubled, actually | henry
		The maximum is 8, obviously | henry
		Moving from place A to place א | henry
		Statistical probability* of an eye | tom
		Eyes in the jungle | tom
		Eyes in an empty lot | henry
		Hidden in the underbrush / Hidden in the asphalt | tom
		Dividing 3 by 5 can give unexpected results under these "circumstances" | henry
		In metaphor, the average corn harvest is 15 | tom
		I prefer Water 7 | tom
		Ordering chicken 65 à la carte | tom
		SUN for 150. AAN for 80. MOON for 10 | tom 
		A collection of -7 items | henry
		Forty several cans of chili | wesley	
		Increasing numbers, mildly | henry
		The sum of constitution, if you will | henry
		Only don't know, go straight | lewis
		In the space between stimulus and response is a yeti, seven snowplows, and 13 kalamata olives | molly
		Consider the likelihood | molly
		Home grown numbers | henry
		One eighth: fraction? | tom
		Two of A is equal to B, ignoring their stark differences | hyacinth
		Full of accuracy | tom
		Don't &you& feel the data? | tom
		Approximating the obvious | henry
		Completely independent (but it's a lie) | henry
		Your percentage is growing | henry
		A healthy brainbeat of 6,200 | tom
		300.24q = 1wM | henry
		A couple "9 and a half"s | henry
		Concerningly low prevalence | henry
		Their precision is unfathomable / Their accuracy... not so much | henry
		2 may be a challenge, but 30 is a piece of cake | hyacinth
	`),
	// things theophrastes would say, high tier stuff, lore
	new Scroll("Theophrastus", `
		An awful mess, you've created. Reincarnate please | henry
		A rapid transmutation and a day off | henry
		Atmospheric noise and the meaning of life | henry
		A home invitation and a sharp decline | tom
		Polarity and a &nervous breakup& | tom
		Sharp objects make it all stop turning, for a little while | henry
		Salted is thy bread, beholden of the tides that bind | tom
		Only place your faith in falsehoods | henry
		The world is fastened directly to your abdomen. You don't need an oyster | henry
		The world is mine and mine alone / Go, get a new name, for it is mine | tom
		I am your only refuge, your only god | tom
		Feel the wrath of your only refuge | tom
		The people that speak is our minds and dreams | tom
		Half a rock, thrown across the bank. It's finally done | tom
		And we never would again. | henry
		Ifcara reached past her domain, idle minds breed reaching fingers | tom
		The gauntness of her philosophy is repulsive, although compelling implications | tom
		You need to feel bad after you read it | henry
		Our minds are too stringent for our own good | henry
		And that's what it is / That's all it is | tom
		Now tip the vessel and bathe | tom
		Life by sharp edges and hard corners | henry
		The lore here makes us look better | henry
		The earth is getting unoriginal as the end nears | henry
		And maybe it'll be okay, maybe it'll be worse then even projected | tom
		To live on your own (which may or may not end) | tom
		Praise, and you may decide your own future | tom
		No one is ever sure | tom
		I think god was getting a little wild | declan
		God's favorite color | tom
		No. You focus | camden
		To know or to wonder? | tom
		The inner workings of your mind are tumultuous | wesley
		We are retracting | tom
		Animate your demons | henry
		A glass of water for Zeus | tom
		Zeus doesn't like the idea of your promotion | wes
		The stars have aligned into the shape of your future! It's a clear day outside | tom
		Nearly comprehensible, on the brink of competence | henry
		I can't even see why knowing would be helpful! | henry
		Threateningly fancy | henry
		We haven't done &this& since, well, a while ago | tom		
		Overcapitalizing as to not displease the king and court | tom
		God is not a figure or object | henry
		It is not the one being worshipped, no matter how much it wants it | tom
		I am the one being worshipped | tom
		I am the one being shipped / Honestly same | tom / henry
		God of the palm of your hand | tom
		Observations are acts witnessed by god | sofia
		You are just a free sample for the gods / You will be picked up with a toothpick and eaten | tom
		Go, speak to yourself for I shall not hear you | tom
		Consciousness is a pipe dream | hyacinth
		I try not to make decisions with consequences | henry
	`),
	// strangeness, moss/plants, good
	new Scroll("Auberations", `
		It happened on a tuesday | tom
		♪ I &can& hear &you& ♪ | henry
		♪ Bouncing on down to New Orleans ♪ | max
		The countrypeople are quite picky | tom
		Moss is [emotion here]. Now, moss is a philosophy | tom
		To see is to believe, to feel is to doubt, and to smell is to be thoroughly disenchanted | henry
		The feeling of being able to feel your voice in the woods is lovely | tom
		My soul feels so crisp at this time of night | henry
		What the hell did I think I was gonna hear this on the radio? | tom
		It's fun to watch y'all manipulate others | shannon
		The packing peanuts entice me | tom
		Being found guilty of counterfeiting settled an unmistakable aura of authority on a metallurgist | max
		There's also a little part in this episode where Liz points out why you shouldn't get rid of all the gods at once, so how does that make people unhappy? | AI
		There have always been a couple rogue linguists | henry
		Make staying-alive-style choices | henry
		The extended metaphor may &never& end | henry
		The desire to imitate beauty is &grasping& | tom
		The stadium is full of moss | tom
		The whole stadium is &full to the brim& with moss | tom
		The ground is alive, in a non-ominous way / It goes down farther than you could dig | tom
		[Name] and [name] are the last ones on this planet | tom
		hyacinth, cindy for short | henry
		Going by "synth" at a grand piano convention | henry
		Thou doth protest only on Tuesdays | wes
		Mist is my favourite flavour of summer | henry
		The moss feels annoying, overdone, derivative | henry
		Try empty voids and epic poems instead! | henry
		You're my moss (affectionate) | shannon 
		The ferns spotted fingers and tickled the toas of all who walked by | molly
		Do you feel your breath today? | henry
		I'm spiraling down to the ferns of my soul | wesley
		The biodiversity of a plane does not denote its habitability | tom
		Cold, cozy plants, resting at the bottom of the pit I call home | henry
		Grass in the alleyway | henry
		Dragonflys make good steeds if your friend is a tree | rowan
		Dishwater consumption is based on morals, or lack thereof | tom
		Slide down the carrots for a fun time! | wesley
		Fully "organic" / Not even remotely stolen | henry
		A moss-covered everything | tom
		The metaphysics of plants beguile us all in the end | molly
		Strips of moss dangling from the heavens | henry
		Finely minced forests | tom
		Close enough to a soul to work | tom
		The second best thing to replace a spirit | tom
		The closest thing to a body you'll ever get | henry
		The package is "damp" | henry
		Keep them dry | tom
		They grow in the bathtub | tom
		My ears feel crisp at this time of night | hyacinth
		Now you know where the flowers | tom
		The plants speek nothing of they're annoyance | ryan
		Keep them submerged 'til they're ripe | henry
		...I may have committed accidental propagation | shannon
		You can't even know how many cells you have | tom
		You just made every tree in this forest an inch taller | tom
	`),
	// cards and games. study of the universe. science
	new Scroll("Boron's Knautsawn", `
		The king of spades is mad at you | tom
		You've been deal a hand of a king of spades and an ace / That would be great for blackjack but this is five card draw and you seem to somehow have lost three cards already | tom
		The cards* are being dealt | henry
		Oh, you &know& what they want | tom
		&The dealers are ready& | henry
		Now play your hand | tom
		Infinite stacks of pale green paper (it isn't money) | henry
		We exist in the space between brain and mind | tom
		The ability to distinguish between smoke and mirrors will be invaluable | henry
		The trees are but daughter nature's haphazard attempts at drawing a triangle | henry
		The whole reality is a game of skill | tom
		That's just the real world | tom
		Reality tears aren't two dimensional, despite what the authorities say | tom
		Playing cards should be worth more. You could try and collect a full deck | tom
		Exuberate yourself | tom
		Do even think about it! | henry
		In the third spacial dimension, there is North, South, East, West, Posck, and Whick | tom
		In the fourth spacial dimension, there is North, South, East, West, Posck, Whick, Deach, and Gokch | tom
		Blind mapmaking has created new, difficult to explore realms | tom
		A semblance of reality | tom
		Tuning the gears allows &proper& thought flow | tom
		I don't think they can hear you. Not yet anyway | henry
		Don't let the devil give you a choice! | AI
		Saying "No thanks" to the devil only makes you look bad! | AI
		Your reflection is not yours to keep, it is simply borrowed | tom
		Mirrors have a wide range of customer reviews | tom
		It's a bit cliché, this life | tom
		Out of the fact, we transcend | tom
		You think &that& will save me? | tom
		Several deities inhabit your attic | henry
		That's very &mauje& of you | tom
		Former, latter, and arnter | tom
		Positive, converse, inverse, contrapositive, and pollative | tom
		Was everyone created the instant the universe was? | tom
		More likely our being sprung into existence sometime after the conception of the known worlds | tom
		Many were possibly created at a single instant, however, to account for the extreme lack of overpopulation, / Either true death is possible, new worlds are still being born, or the theory is incorrect | tom
		If the latter is to be held as truth, the size of this universe must be staggering | tom
		How can such information be held? | tom
		If the former, then where are the boundaries of these worlds? | tom
		If true death is possible, is it balanced or will we go extinct? | tom
		Think or be thought | declan
		The Knautsawn was contructed, in mind at the very least | tom
		Drawing a card from a standard 40 card deck / It's &your& future | henry
		Fire, water, cloud, air, stone, and the invisible heuristic | tom / shannon
		Air, Wind, Sky, and Atmosphere / The four elements surprise some... | henry / tom
		Nothing but the sand you came from and will return to is free | tom
		Alone in a randomly generated landscape | tom
		Curiously, intellect and flammability of the body appear to be linked | tom
		An ununique copper tube is all you need for this one | tom
		Although concerning, the variation of particles seems to be stable | tom
		Pawnes, both Towers, both Judges, Prophets, Seamstress, King and the Sun, set upon the board | tom
		Antiquity, ambiguity, quality / My favorite children's game | henry
		Ambiguity conquers antiquity | tom
		Quality triumphs over ambiguity | tom
		Antiquity &beats& quality | tom
		Antiquity begets quality | tom
		No event is independent | tom
		The distinction is important | tom
		Sewing is a way to talk to the inanimate | anna
		Threading the needle through #thick# and &thin& | henry
	`),
	// sea and salt and food
	new Scroll("Kelp", `
		Salt in the sea brings you to your knees | tom
		You fall to the salty depths | julian
		Loops upon loops | tom
		There's nothing but more humans and they're just as confused as I. Where is everyone else? | tom
		Looking around: are we all grammatically correct? | henry
		Joy is a boundless restriction | tom
		Randomness is the salt | tom
		I value sleep with cities and gold | tom
		The habitat is no longer safe. Maybe it never was | tom
		I came for aspirin but I wound up with chocolate | wes
		The powdered joy too often comes out in clumps | molly / henry
		My brain has been clogged with hair and the seratonin won't drain | henry			
		Some regions of the brain are likely to be burgled | henry
		Singular. Drops. Of. Water. | henry
		Fish on the land. Sky in the sea | tom
		Fish on the window | henry
		Those in the windows / These in the trees | henry
		Any time, any place, amidst the sea, it's all the same | henry
		Mirrors have varying levels of reflection | tom
		Solid food for infant mermaids | henry
		The dairy isle holds your next clue | henry
		We all scream for ice cream | henry
		The ice cream screams for salvation | henry
		We can bounce things off the moon to send plain text messages between chairs at a table, so where's my ham \\& cheese?! | henry
		Where's the cake? / Why's it so loud near my eyes? | henry
		That once when figs fell from the sky and dazzled with their bioluminescence | molly
		The cauliflower danced a jog and sparkled in the gloaming | molly
		The seaweed is running rampant, right now, in the wake of the ocean gardener's strike | molly
		Just a whole lot of curry | henry
		An apotheosis of pickles | molly
		"Would you like a side of flies with that?" | molly
		Cauldron without stew | tom
		The carrots try their very best and yet they still disappoint | tom
		Avocados' origin story: when a pear seed suffers a Messiah complex | molly
		We could eradicate custard, but where exactly would that leave us? | molly
		Negative calories in strings | tom / hyacinth
		Negative salt in a watery world | tom
		Taco meat cooking in the crockpot on Tuesdays | mayzie
		Combining beans in unforeseen and possibly revolutionary ways | henry
		A warm cup of nice, salty ki'e | tom
		The water's purple in the paling sunset | henry
		What is the line between a sample and a meal? | tom
		An overdose of sᴀɴᴅ | hyacinth
		Hello. We are all feasting | molly
		Fruit of your fruit tree | tom
		Strictly healthy items | hyacinth
	`),
	// ceremony instructions
	new Scroll("Ceremonisms", `
		Humming and warring | tom
		They arrive in many turns | henry
		Take up a new hobby. You'll have to, eventually | henry
		Lock your doors, open your windows, and call upon your neighbors | tom
		You will go and I will follow, in my own twisted way | tom
		Intertwined, measureably | tom
		All light is simply a byproduct of your own twisted constructions | tom
		Identical depression and twins | tom
		It's nothing personal | henry
		Home is where you play open handed | henry
		Peanuts are likely to have tiny hats | declan
		A bearded man is present within the legumes, if only you choose to find him | henry
		A man is coming out of the oven | tom
		I feel I know everyone and nobody | tom
		Myopia is an inadequate foundation | henry
		The fibers have prevented your self-realization | tom
		Don't forget \\& don't remember! | AI
		A strong, ancient voice calls to the world | tom
		The metal helps more than it hurts | henry
		Draw the curtains on the sky to let the powers that be slumber | henry
		Throw open the earth and free those below | henry
		The lil' guy is all wound up | henry
		And the uncanny Illumit befell upon the city and the twisted bowl was a false protector / The dwellings crumbled like those within and the twisted bowl filled with blood | tom
		Instrumenting your wishes | henry
		The best part was there wasn't just one | tom
		Master your worst skill on the weekends | henry
		A dignified prophet, Pht., if you will | tom
		Generated\\/gathered for various purposes | henry
		Praying for departure requires octagonal perambulation for the best results | henry
		Lock your doors and windows, hide in the basement, and wait for someone to arrive | sofia
		Hiding in the basement / run from their glance | henry
		Oh the keys they burn / Please cool your keys before preparing the ritual | declan
		Unexpectedly, we congealed | molly
		Your papers are lacking the proper signatures plus a certain je ne sais quoi | molly
		Overcome by an influx | molly
		Morally ambiguous "you" | tom
		&Now& you're alone. It'll be over soon | tom
		Never finished, always started | tom
		The minification is &desecrated& | henry
		We can discuss later when I'm less purist | tom	
		We're to become cultural values | henry
		We go to bed and floss our minds | ryan
		A pilgrimage to the ground | tom
		Pros of being buried: #&dirt&# | tom
		Running towards your next life! | tom
		We're just prophets for a godless religion | tom
		Locked up and damned souls | tom
		Hallowed be the hearts of earth | henry
		Impending age / Incoming sage | henry
		A jail for the mind while the body roams free | tom
		They sung a hymn for a peaceful next life | tom
		Corpses are 97.05% &hydration& | tom
		Your shadow may leave for a time / You will accept this | henry
		The sun actively racing towards the ground | wes
		The trouble is, some people don't &need& the drugs | wes
		Toiling and tumbling, up and down | henry
		No afterlife = No beforelife? | tom
		Ancient domains rumbling below | henry
		Scrying the bioluminescence | molly
		They don't just extract the blood (exasperated) | henry
		Eye removal techniques (ecstatic) | tom
		The rind of the husk of the crust of the day | hyacinth
		A murmuration of priests filing through the walls | hyacinth
		The hands are striking | henry
		Remaking your bones for a stronger statue | tom
		Resurrectionism and the inhuman forms | tom
		Sometimes the structure calls us near, mourning | henry
		Invisible to any eye you can muster | tom
		Hiding outside in the &other place& | hyacinth
		Strolling through &their& area | tom
		Running through "my" area | hyacinth
		Hiding in places you should be hiding from | tom
		Graffiti on your hands and eyes | tom
		Don't eat 'til it's over | hyacinth
		Bits and pieces of your heritage | hyacinth
		No? Then I'm gonna look more at that strange diagram | hyacinth
		Truly a shame; they've never been open. Ever | tom
		Every inch is still, but you're definitely still here | hyacinth
		I refuse to speak any longer for it is getting full | tom
		You know all my favorite sins | tom
	`),
	// disconcerting ones, void/emptiness
	new Scroll("Splines", `
		Scream, for they can hear you / Sing, for this is literally a recording studio | henry
		Splines cannot have hurt you | tom
		Attic is towering | tom
		You must not be italicized | tom
		Passages through the void, find nothing else | henry
		Pulling through the dark zone is... unadvisable, though definitely encouraged extracurricularily | tom
		As long as you're off the premises, we can't stop you | henry 
		The void wishes for your company (the feeling isn't mutual) | henry
		Scream against the void that is your friendship | henry
		Don't look them out the eye | henry
		Accurate predictions strain the system | henry
		You shalln't see anything of significance if you look | henry
		We don't leave any more | tom
		But your mouth does not open | tom
		You set down the weight and your shoulders feel heavier. You could have predicted this | henry
		The load you bear is not yours to release | henry
		The alternative versions of the present are your favorite | henry
		The alternative presence of the versions scares you | henry
		Your temporally negative doppelgänger is likely a bad judge of character (especially yours) | henry
		Your temporally positive doppelgänger is limbless | tom
		Your soul (it stings) | henry
		OctoDachshund | molly
		The spirits hush my voice / I scream, but I cannot | tom
		Rice voids, emptying spaces you could use | henry
		Stop trying to outrun the void you leave in your wake | henry
		Yell into the space you cannot feel (only when you feel lost) | henry
		Don't scream until you're right there | henry
		The chasm is closed to visitors today. Try again tomorrow | molly
		A quiet acceptance of the void between my ears | henry
		Voids in the family room | henry
		Sorry I'm late. Traffic jam in the void | molly
		They just look stoic | julian
		Yodeling into the abyss | molly
		Smiling does not necessarily denote a good person, or lack thereof | tom
		Consider a chasm, filled with Spam | molly
		Recycle your body so we can crystallize the sweet sodium inside | declan
		Cold strands of your mind, leaking and dripping from a slit in your forehead | henry
		The web of lies is created by the spider of inconvenience | declan
		Sculpting the mayonnaise into a form, resembling emptiness | molly
		The scorched earth is still alive | tom
		Scars on the walls, blistered and burning | tom
		A plethora of useless toys | tom
		Your daughter is beautiful; fossilized | shannon
		Ribbed walls, tracing your mind / Drip. Drop. Drip. Drop from the ceiling as you start to break | henry
		Depressingly lemon | tom
		Uncomfortably lime | tom
		Wow! Such ᵃⁱʳ! It ˢⁱˡᵉⁿᶜᵉˢ ᵐᵉ! | tom
		The windshield is cracked and the car is rapidly deflating | tom
		Your hair is easy and soft / Permeable even | henry
		The superficial having of hands | henry
		Drawing the witch closer | tom
		In fact, you knew your own reactions | tom
		Purple is the primary color | henry
		Hives in your open-shaped organs | tom
		"It screams" | tom
		Rearranging and adding to your bones | tom
		Honey fills your lungs with buzzing | declan
		The head is an odd choice for the brain's hull | henry
		The creatures are coalescing into and outside of the cocoon | tom
		Everyday screams / Frightening smiles | hyacinth
		I am them, but they don't know that | tom
		A truly disconcerting comparison | hyacinth
	`),
	// instruction, emotion, feeling, slightly disconcerting. good proverbs
	new Scroll("Winding Respirations", `
		Luminance and the ethereal, it flows beneath | tom
		The undercurrents of our consciousness are blue-green and roiling | molly
		Don't mask what you can't see | tom
		Pretend you aren't breathing | tom
		The seashells are strewn across the counter. If only this could last | henry
		What's on the counter | henry
		Nothing amidst the fluid carries the answer | henry
		As you fall, look behind you | henry
		And I was watching as it suddenly changed | tom
		They shift subtly when you aren't looking | henry
		Walk 'til you can't run anymore | henry
		Close your eyes and just breathe | tom
		Lose yourself and find others | henry
		If I can get that antique to work... | tom
		An altar? Never knew they existed | tom
		Altar more like alter | tom
		The feelings are enumerable | tom
		Personal feelings, growing out of bounds | henry
		How many shells gathered? How many more? | tom
		The death of Pleo-Jovia | tom
		The pipes don't serve the people | tom
		Now &you& know what the deal is | tom
		Here is where the heart is | henry
		Don't fear what can't be broken | henry
		Tendrils of emptiness snaking around your broken body | henry
		"Alive" is more a spectrum, rather than a boolean value | tom
		I wish to be treated as a descent into chaos | wesley
		Feeling an emotion twice at the same time | tom
		One too many emotions, I think | henry
		Emotions: buy one, get one free! | molly
		Inhuman Intellect #will# deceive you. Please leave your emotions at the door | tom
		Altars and doorways are synonymous | tom
		Evaporated emotions on the spotless mind | tom
		Roaming the terrain of antiquity | henry
		IH: Inhabitable / SH: Sparsely habitable / MH: moderately habitable / H: habitable / E: exceeding | tom
		They can hear your shock | henry
		Go on, drink their life force | henry
		Throwing the gears in the recycling | henry
		We can't promise that you'll see the end | henry					
		Can't hear what's going on | henry
		See &exactly& what you see | henry
		Unknowingly distressed at the possibilities | tom
		Every pebble and grain of sand you see has been expertly sculpted by us | tom
		Stunning "compassion" | henry
		Abnormally considerate | tom
		Climbs violently up moral high ground | henry
		The arena is &flooded& with tears | hyacinth
		They draw ever nearer | hyacinth
		They are listening for recreation | henry
	`),
	// disconcerting, death, blood, liturgy
	new Scroll("Liturgical Lifeblood", `
		The patchwork is incomplete | tom
		Only you see it that way; this is good | tom
		If you're worried, then examine the glass, the grass, and the breeze | tom
		No one among you can understand the gravity of what you've done | henry
		Wicker lanterns, dancing 'til there is nothing left but light | henry
		The fruit smiles, your time has come | henry
		Why must they anger us so | henry
		The road doesn't work ahead. Stop hoping | henry
		There is always time for flexibility at the end of a candle | henry
		You're viewing it in the wrong dimension, you goofball | tom    
		For there shall come a time, when a time comes | ryan
		A small fraction of you may end up happy. Although it means no harm to you, many of you want to leave | AI
		I'm going to turn you into a ghost | max
		The weight of emotional release will be passed on to someone else | tom
		When one moves briskly, the air will freeze on their hands | tom
		Your breath illuminates the things you try to ignore about yourself | henry
		A scathing critique of the faithless | henry
		Hear them walk through the halls | henry
		Pretend that didn't happen, if you want to keep your skeleton &within& you | henry
		They were four long and four wide, with varying heights. The volumes were all the same | tom
		Pouring is easily done, more so with skill / One skilled at this is quite a sight to observe | tom
		What is the time and why does it chase me so? | tom
		Put on your &blackout gear& | tom
		What the sturgeon lacks in literacy and liturgy, in makes up for in antiquity. And whiskers | molly
		Bloodshed shall sweep across the kitchen | declan
		Atmosphere of glass | tom
		Feeling the glass in your throat | henry
		Fabric woven from soul fibers | henry
		...well ...It could have been your blood | declan
		Candles; a fragrant way to burn your house down | shannon
		Shattered in fire, built in the souls of the hallowed | tom
		Forcefully making my heart beat | tom
		Blood and tears for the flower | tom
		Unformed eyes | tom
		He approaches | camden
		Eat. I hunger | tom
		Blood loss is as blood loss does / &Bad& | tom
		Papers in the gaps | henry
		Like death, but you stay with us | tom
		They will predict your death with great accuracy | tom
		Experiencing murder (but from what end?) | tom
		Nothing else to do but use the flannel for fire | tom
		Fire to feed them and the children | tom
		Husks of the soul | hyacinth
	`),
	// neptune and their wisdom and wide instruction, water
	new Scroll("Neptune's Quenches", `
		Endless fits of understanding | henry
		Silent nods of laughter | henry
		I had a dream where all my dreams came true | tom
		Sometimes fits of arise | tom
		Predictions are a thing of the past | ryan
		If the sky is original, the ground holds possibility | anna
		That may have been a deception | henry
		Just keep doing this forever and you'll feel awfully mediocre | henry
		Doing nothing is not a substitute for living wrong | henry
		It is the event | tom
		The choice of being me over you is one that I will choose | AI
		Your identity is only as strong as your willingness to leave | henry
		Pretend you are an aglet. Now stop, please. Tell us your experience | tom
		Neptune stretched their cloaked fingers and it was done | tom
		They bathed in the new light of the Illuminating | tom
		You feel the air settle around your shoulders, you are at peace | henry
		The tears run up your face as you lose your voice | henry
		Neptune awoke on the beach, but they were not conscious. Nobody is | tom
		And the night looks on, bemused | henry
		Telling them why they can't breath is exhausting | henry
		Anything is organized with the &correct& perspective | tom
		I haven't &ever& seen you this young | tom
		Only false gods lack domains | declan
		Narcolepsy is an effective method of transportation | tom
		You must speak before truth is possible | henry
		Boron, he thought death was optional | tom
		You can't ever really be &dead& dead | tom
		You wear death but you haven't know it for a while | tom
		Don't remember last time? | tom
		And now we've met! | tom
		The copper turns green and the iron turns red in an instant | tom
		Iron rusts, copper oxidizes, silver tarnishes, and you persist | tom
		The correct tools shatter the most persistent of knots | tom
		Finding yourself in an empty room | henry
		Subsumed by the uncanny serpents | henry
		Radio signals in a desolate landscape tell me just how far I am from home | tom
		Rain in an instant | tom
		Mayday! Mayday! We are awake | henry
		Resting on a copper plane | henry
		Take the fishing boat out only after 2 am | anna
		Undesignated bodies / warm, high, n dry | tom
		I'll be back soon, in a matter of speaking | molly
	`),
	//stones
	new Scroll("Ossuary's Fingers", `
		A touch is not a stone | tom
		The last step is to bring the stone into the furnace | tom
		You do not remember the stones | tom
		The stones welcome you into their ranks | henry
		The stones hold memories and cradle them, softly but firmly | ryan
		The stone keeps watch on you and your future | tom
		The stones guide you through the valley to a new life | tom
		Stones encrust your skin | henry
		Minerals amidst your veins | henry
		Stones offer protection from the sun, and you are always at peace | tom
		And you are still a stone | tom
		Driven from your home, the stone-lined path guides you to your next | tom
		They must not realize what this stone arrangement meant | tom 
		The stones contribute to the rigidity of your knuckles and vertibrae | henry
		Backstones | tom
		The stones in the mountains #contribute# to the ritual | henry
		The stones will encourage you to leave, &soon& | henry
		Gems were found as their last resort | anna
		The nobility held the gems captive | tom
		Sealed salt for use as decorative stone | tom
		Stones spiralling slowly towards the gate, peaceful and solemn | hyacinth
	`),
	// singularity
	new Scroll("Aplicality", `
		A single grain of milk | tom
		An entirety of a bird egg is but a shell | tom
		They are right, for they come from below | tom
		They are left, for they come for above | tom
		Only look down | henry
		A word is worth exactly three sevenths of a length of string, as determined by the latest census | tom
		Drifting with a single strand | tom
		Barely one of us left | tom
		You are now one of these two souls | tom 
		Fugue in the deepest of nights | tom
		Everyone &else& is a figment | tom
		You are a figment of your own imagination | henry
		The whole can be defined as singular | tom
		One frame of life | tom
		I have a soul? You've got one of them! | henry / wes
		You're only #Born# once (not to be confused with "born") | tom
		Opticular ones? Don't exist | tom
		The moment! Here it comes... | tom
		Precisely one debacle | henry
		Exactly one tad | henry
		That's a real thing | declan
		Units of sustenance | tom
		I am a cell in a bigger body | ryan
		First day my next life | tom
		Plus one days! For you | tom
		Maybe a raincoat | molly
		A singular knive | henry
		We've successfully and without harm added a particle to this realm | tom
		It's TINY, but it is ʜᴜɢᴇ | henry
		Decaying in a lonely chair | henry
		This road is only subtly different from a trail | wes
		It's been goin' on since day one | tom
	`),
	// sun, cycles, duality
	new Scroll("Shifting Ties", `
		We keep our gnomes around for the season | tom
		Look how long that hat is | tom
		Dinosaurs are a primary component of the industrial revolution | henry
		Heartbreak and insanity often coincide for crustaceans | henry
		Nothing you say can or will be used against you in a court of law | henry
		You keep forgetting that you are confused | tom
		Olive trees, despite their beauty, do not | tom
		The limits of the tree are infinite, albeit two dimensional | henry
		The stars will be caught up soon! | tom
		There is the soil, there is the stone, and there is something below | tom
		There is the sun, there is moon, and there is something else | tom
		This is paradise, and our existence is one more time to die | AI
		You wouldn't feel it if it were right | henry
		I wish the letters would manage the din | henry
		I don't think it's healthy | henry
		Continents are meant to be broken | tom
		Still looking for the center of balance / Averaging the component parts hasn't worked since I was a kid... | tom / henry
		You knew what I was going to do | henry
		Slightly off-kilter diction where you thought you'd see advice | henry
		Nothing will fit on your shoulders | wesley
		WOW! You have a SUN | tom
		The sky is creative, despite the sun | tom
		Despite all we'd done, the sun rose again | tom
		Your head rings with the light of a thousand suns | henry
		There's a single thought connecting two of you | tom
		He had eyes of diamond and metal. A heart of gold and rust | tom
		You #know# nothing happened | tom
		Trip today, not tomorrow | lucas
		Stay within the patches of sun | tom
		Sun and soul / Reflecting the sea / Waiting in time / For powers to be | tom
		Hanging by your last strings, you rise. / A flower does not grow to be cut / A book is not written to be burned / You stand / Not to get your strings cut / but to put things ri... | tom
		She's the creator of this intrepid and lonely homestead | tom
		A handful of mysteries add that little bit extra to this universe | tom
		Your eyes / You look / They stutter / You collapse | tom
		Whipped wind and a good feeling | tom
		The rind of the husk of the crust of the day | hyacinth
	`),
	// ...'s and random characters and things that dont make sense
	new Scroll("Freud the Spinner", `
		A book is ㅋ | AI
		I“ʘ I don“x“? Yes | AI
		Ankh per size but not a length | tom
		Ankh per width the depth of ships, amidst the life and death there is | tom
		Ata khe ata! | tom
		Edge on edge! | tom
		Dog is lode | sofia
		Intel... outside | tom
		Escape! Escape! &Escape!& | tom
		Scrolling past trees and breeze. Like, y'know... | tom
		I am not that type that can write scripts, I am just... | tom
		*aerates quartz* hmm, yes... a hint of walnut | henry
		Please press 'Enter' | henry
		We &always& hold 'Shift' | henry
		Ipi, Di'a, I'a'ti, Kat'a, O'po'li, Si'o, Si'e, Si'un, Ker'o | tom
		B3t u d1dN"t s3e {#this.#} com1nG. rUn t0day and CAㅋL "today" | tom
		warrant a play a ▄▀g▄▀a▄▀m▄▀e▄▀ | tom
		▀▄g▀▄a▀▄y▀▄ on a rainy day | henry
		Clocks on the walls / Clocks in the halls / Clocks in the stalls / Clocks in the shawls / Clocks in the hauls / Clocks... | henry
		...in the Malls | henry / tom
		Clocks in the Xalls | henry / tom
		...as you fall through the sand | tom
		Oh, to be an idiot in a castle | henry
		Bricks? Bricks! Many for a penny | henry
		A die in glue | henry
		Wow! It glistens! | henry
		Stripes on stripes on stripes! I see my #soul# | henry
		An #&iota&# of injust circumstance!? | tom			
		Abandon all here ye who enter hope | molly
		tHE cYLINDER hAS bEEN rMOVED? | tom
		Lost! In the liiiiiibrary | tom
		S- S- Sliced! | tom
		...and they shall be gracious | tom
		Now t-t-t-that is what w-w'''ere here for! | tom
		I CAN'T HAVE ANY UNIQUE THOUGHTS IN THIS ROOM | henry
		Asterisks of inaccuracy | henry
		#T-t-t-t-two# spheres in one! | wes
		ᵍʳᵉᵃᵗᵉʳ ᵗʰᵃⁿ, &greater than&, greater than, #greater than#, ɢʀᴇᴀᴛᴇʀ ᴛʜᴀɴ, #ɢʀᴇᴀᴛᴇʀ ᴛʜᴀɴ# bold! | henry
		Hello?! The earth?! Hummus beneath our feet?! | molly
		Vibrant lights / Sparkling in the night / Ever after we sleep / Die. | henry
		Motes in the air / hair in the sky / Fly in the sea / Be for an eye | henry
		Order word matter? doesn't | tom
		Psychiatry* will save you | tom
		Σodra D7dug was a being created of coincidence and intention | sofia
		Paper: ready. Poets: liiinnnned up. Solution: infallible | tom
		Personally, it's no(t|w) a decision I would make | tom
	`),
	// landscapes, new location
	new Scroll("Exlareel", `
		That was an awful "place". I was there | shannon
		Oh dear! I'm so sorry you had to see that! ᴠɪᴇᴡ ɪᴛ ᴀɢᴀɪɴ | henry
		What a time to be Alice | tom
		The questions you ponder shall remain | henry
		Parallax universe. Don't be so sure of existence | tom
		Gaze upon the wasteland before you and know your place | henry
		Avenge the risen, for the fallen have come too far | tom
		They let you come here. Don't mess up | henry
		Do your very best to make the first good action you take not be your last | henry
		Consider the distance you must fall to reach the sky | henry
		Where can you find several oysters? | henry
		Ghostwritten acknowledgments | henry			
		Typography is going to be a surprisingly luctrative profession | henry
		A pilgrimage to the end of the road | tom
		Wildflowers and open hillsides / Heights beyond that which is below / and a soft breeze | tom
		The zoo is expanding, far beyond its proper limits | henry
		You leave your homeland at least once | tom
		Such an earthly world | tom
		Places to meet and people to be | henry
		Moving on to new realms and new days | tom
		Seek what is beyond the hill | wes
		So close to the end of the road, but the pavement's getting warmer | henry
		Highest tier items in a collapsing home | henry
		Missing from a place we call "enemy" | henry
		They don't like you | tom		
		Brilliant blue blazes brighten heralding the end of the world | mayzie
		Comprehending the "natural" world will forever be impossible / Let's leave it at that | henry
		Shaved dimensions | tom
		Domestic ordinance / Shocking depth to the everyday | henry
		Swimming through the planet | tom
		The height of the earth mostly influences the red channel | henry
		Causing confusion without meaning | tom
		Seven is a bad way to divide the continents / There's clearly five: Eastern Australia, Western Australia, The other land, the sea, and the sky | max
		*Our home in the trees | hyacinth
		Once here, you certainly once have | hyacinth
		Several bridges between the locales | hyacinth
		Home address: betwixt and between | molly
		We cannot &be& farther (exasperated) | hyacinth
		Endless columns, drowning in vines | hyacinth
		Nobody's gone beyond the boundary | tom
	`),
	// sea, dreams, reality
	new Scroll("Tidescales", `
		We, you, they, everyone. All continue | tom
		Dreams are the reality and what seems is the dream | tom
		The ships that sail the sea defy the powers that be | tom
		Bring them to me | henry
		A furious cocktail indeed | tom
		Circles intersecting makes the dizziness go away | anna
		Spend a lil' time in the panic room | tom		
		Don't place your faith at the start line | henry
		Give up on the dreams that push you further down the gravel path | henry
		Dreams within your heart will do whatever they can to break free, even if it kills you | henry
		Your surroundings are exhilarated | henry
		The glass is unbroken, your sleep is peaceful, and your mind spins in the emptiness, waiting for dawn | henry
		Both love and smell are blind, given time | henry
		Several objects can be swapped for interesting effects | henry
		Your mind bends when you approach your temporal limits / twisting away from common sense | henry
		Cyclic in an infinitely precise universe | tom
		You wouldn't know reality even if you died | tom
		The seal on the envelope you call home makes it easier to stop wondering | henry
		Although the material isn't waterproof, the craft is | tom
		The building block of civilization is ability to ascend | tom
		Reality is currently currently experiencing technical difficulties. Please try again later | molly
		The cloven-hooved cod was once a deep sea spectacle, but mediocre once battered and fried | molly
		Simply boil down your hopes and dreams | henry
		Don't run from your dreams... Or your nightmares | henry
		Out of real life* | tom
		And they spilled over the rocks | henry
		You have never been home | hyacinth
		It will certainly try | tom
		I'm the little picture | molly
		Unbridled, dream-free charisma | tom
		Mind alight in an empty room | henry
		The room is &empty& | henry
		Wallet for the ocean | tom	
		Maybe they'll dream | tom / henry
		Ever denser, Ever smarter | hyacinth
		Such floof, such bliss | tom
		"Conscious" doesn't even begin to describe it | tom
		We cut ours out of nothing / There is no greater whole | henry
	`),
	// chaos, disconcerting, high tier stuff
	new Scroll("Carnalicy", `
		You will cause chaos if you try and leave | tom
		Pulled from the jaws of real life | tom / henry
		Ripped! Just like reality! | tom
		Reality is objectively arguable | tom
		Gravity is objectively arguable | tom
		Face the enemy, find the enemy, dispel the enemy | tom / AI
		You have died of blunt edges | tom
		I stubbed my toe on the nature of sharpness | henry
		The vessel is open | tom
		The air was filled with silence as I stood in the middle | henry / tom
		I levitated with aplomb until they pulled the air right out from under me | molly
		Even though everything is so well planned, you're going to be the next one | tom
		You're far when it doesn't hurt anymore | tom
		Many who I cannot name | tom
		You can't tread far from home | tom
		Be careful, or your permanent record will go on you | henry
		A rich lode of scandal and alleged crime | tom
		Everything is being &ripped apart&! The best part is it was &hollow all along&!!! | tom
		If it wanted us dead, we would #all# be dead | tom
		The distinct lack of emptiness is jarring | henry
		Eyes? How about conveyors of lies | tom
		Show me how it pains you so | tom
		Body language, bone language, spirit language. Collect four and you will be pursued! | henry
		Where we see a mountain, they see a crevasse | tom
		Passing thresholds in our minds | henry
		Completing your goals leaves you with no purpose | tobyn
		They're almost at the door (they just want to #talk#) | henry
		Where we see a tree, they see a thicket | tom
		Growth in the off season...? | tom
		Fully grown, not nearly in time. Nothing is ready | tom
		They still have an overwhelmingly real world theme, but it's getting better | henry
		Entropy kisses and kills us all | tom
		Ordering phalanges à la carte | tom / shannon
		They're almost #here# | henry
		The more you scratch the more pebbles come out | declan
		Woolen beasts of great demise | tom
		Slithering, sliming, climbing to victory | henry
		It's like dinner, but without the food and only knives | shannon
		Static outside of your front door | henry
		Knives for the weak | tom
		The consommé of souls was bright and clear but woefully insubstantial | molly
		Leave your body to the food bank in your will | henry
		The cables are pythons and you are a trapped animal | declan
		Fighting the urge to release one's soul back into the wild | henry
		Approaching the far | henry
		Nearing the weak | henry
		Consuming the strong | henry
		Feeding the restless | henry
		Decrypting the marks on your teeth / Fear what you may find / Revel in that which you won't | henry
		Kissed, killed, and reborn | tom
		Ribcage for a birdcage / Birdcage for a ribcage | tom
		They sung a hymn for a peaceful next life | tom
		Don't get too far from the beast | henry
		Eyes wide / Grin wider | henry
		Your body image is ᶠ ˡ ᵘ ᶜ ᵗ ᵘ ᵃ ᵗ ⁱ ⁿ ᵍ  ʳᵃᵖⁱᵈˡʸ / It has a third eye | henry
		Sleeping in the inbetween | henry
		Hear yourself breath / Now stop / You decide | henry
		Life goes on, perturbed but otherwise unchanged | tom
		It hurts better than it ever did before | henry
		Your soul is not clean enough to be sold | tom
		Not a scratch, but a ʷᵒᵘⁿᵈ | henry
		You don't fear being eaten alive... do you? | tom
		Kill the head, again and again | tom
		Your heartrate is climbing | henry
	`),
	// short-mid length, universe, moon, machine
	new Scroll("Lunar Parchment", `
		Cofusation | tom
		Do not consider the monotonality of the fungus | tom
		Late onset IQ deficiency | shannon
		The vacuum followed me as I ran | henry
		The average height is recursive | tom
		The moon is not our enemy (probably, it hasn't responded yet) | tom  
		Refumigate your house on the full moon | tom
		You don't know what the wizard does | henry
		It's not worth it to try and figure out how the wizard does | henry
		Live 'til you shouldn't | tom
		Be careful 'til you can't | henry
		Clarity 'til it's over | tom
		Splitten rope giveth the trope | tom
		Thy sun is not identical | tom
		Help! It's asleep! | henry
		Love in an instant | tom
		You can't hear the parchment, though it wails so | henry
		Courting in an amber room | tom
		&this room looks kinda amber& ;) | henry
		A cup is not a cup because all cups are stretchy bowls | shannon
		A new machine, to grind you to tiny pieces | tom
		Why can't I hear your name? | henry
		Playing on a machine we mostly still have | henry / tom
		Oats in the machine | tom
		Living organism in the machine | tom
		Your eyes are like the sky. Unpredictable and wet | shannon
		The clouds no longer care | tom
		It was here a second ago | shannon
		Something was off about this morning, for the air contained a small quantity of cyanide and a sprinkle of chives | shannon
		If a little knowledge is dangerous, libraries are #hell# | tom
		The night can be lighter than the day | anna
		Just because we can't do anything, doesn't mean we shouldn't | henry
		I shouldn't feel safe here but I do | shannon
		The moon leaving / into the abyss | henry
		Indivisible clarity in the dying universe | tom
		Grinding the midnight hours | tom
		Damn the moon is #big# tonight | tom
		Earole and Morles could be successors / The pregnancy times are &off the charts& however / We must wait | tom
		Safe, above and below | tom
		They are &whirring into action& | hyacinth
		Rings for your non-physical appendages | tom			
	`),
	// music, writing, art, creation
	new Scroll("Jeryity", `
		The music is ever present. Embrace it or perish | tom
		We heard that it would end in a museum, but it hasn't yet | tom
		The pictograms are chipped at the edges | henry
		Slanted hieroglyphs for you and yours | henry
		Oh glorious instrument, it rhymes! | henry
		Music on the walls, indicating you should run | henry
		You can't hear them, I can't hear them; who's ringing the bells? | henry
		We don't know what's echoing / Nobody said anything to spur it to action | henry
		Don't hear them, only listen | henry
		You don't have to listen to that | tom
		Formatting for the apocalypse | henry
		Authors, like dogs, can only hear your tone of voice | henry
		Fuzzy clay can be found just under the igneous layer | henry
		The tune is sad, melancholy, &meaningless& | tom / henry
		Change the title accordingly | henry
		Parenthetically, it was all resolved | molly
		French isn't turing complete | henry
		Foolishly, I took the eggs | tom
		Monotonal phosphorous can only be obtained by the unimaginative | tom
		The insidious prince only exists in your mind's paintbrush | tom
		Put your brain together / Now you might as well just think | tom
		Spinning, in circles, without a rapport | tom
		There is a slim chance you will hit thirty or more | tom
		The attic oozes jello while the band plays on | molly
		I wonder if pianos can feel the constant agony of their keys being abused. / The music that plays is just their screams | shannon
		Tune the audience | henry
		Don't use &direct& quotes | henry
		Shielding children from literacy | tom
		Designing for the evil overlords | henry
		Don't be afraid of your creation (it might not hurt you) | henry
		The creation has a mind* | tom
		Composition and composer | tom
		Rapidly approaching author | tom
		Fourth person - at your door right now | tom
		Lime-green covers of "solid" books | henry
		It's obstreperous how innovative you are in this &specific& moment | henry
		It makes tangy text | henry / molly
		Walk the path of revision carefully, and tread not so far as the forest of loss | tom
		Strangers are truer than fiction | molly
		So many more words than you ever expected / The madness seeps in as you read | hyacinth
		You sit in judgement but can't spell "beguile" | molly
		Paradoxical is just &standard& weird | henry
		Surprisingly, the two connected works have several parallels | henry
		Frustratingly mild snaps (&arpeggioed&) | henry
		50,000 lines and the only thing different is my first and last name! | tom
		You've received a "letter" | tom
		The Music is always True | ryan
		Goddamn you #love# that music | tom
		They're biting the cellos | henry
		...nd he played on as it happened | tom
		It's perfect for my movies | tom
		Frightening words with everyday definitions | tom
		Frightening definitions of everyday words | hyacinth
		Tell me, O Muse, of the man of many devices, who wandered full many ways after he had sacked the sacred citadel of Troy | julian
		Motifs of your free time | henry
		They read a simple poem | henry
		Tooth maracas | hyacinth
		There was a book and our family found it | wes
		That almost deserves music notes! | hyacinth
		Drawing the curtains in pen | hyacinth
		...but you've already been written? | tom
	`),
	// confusion, random, less philosophic
	new Scroll("Hyubert", `
		The cupboards contain boundless hope (bounded of course by the cupboards) | henry
		The grass is greener on the side closer to the chemical plant. Neon even | henry
		It's only Source Sans Pro? Always has been | henry
		10-12 times a month, they hunt | henry
		I see... you've seen. You've seen what it feels like to be an asshole | AI
		We are there yet. What now? | henry
		Psst. You're missing a color | tom
		Splitshop in the middle of the state | tom
		Left right in the middle | tom
		Scribbling is an unproductive mechanism, built on obscure and unjustified beliefs, / however its uses will soon become apparent | tom
		Alight from your fingers | tom
		The items used to control the radiation are frequently quite greasy | henry
		City of Smiles | henry
		The Big Mind Reset of the New Year | tom
		The garbage speaks, before and after | ryan
		Chicken nuggets are probably a hoax | henry
		Lived you have not, until enveloped in the gourds you have become | wesley
		The sheer mindfuck of a group of children in a circle throwing rocks | tom
		Bob is your uncle | tom
		An onion is very much like the earth, in the sense that it has many layers and can't do calculus | henry
		The air feels thicker than the ground | tom
		A dark spot where the sun was shall fall into the dark | tom
		Don't do drugs, become absorbed in unreality instead | tom
		The difference is that a spoonful of sugar is not much | tom
		And he wanted to give you some pudding, and that's it! | max 
		Blue indicates you should #stay#! stay! &stay&! | henry
		Crumbling sidewalks typically are a facade | tom
		Earthly storefronts are frequently in the business of disguise | henry		
		Flicks hair before turning awake | tom
		Shirtless in a removable vehicle | tom
		Laundry is a team effort when &they& arrive | henry
		My neck is going to be excessively flexible for the rest of today | henry
		Borneo, Borneo, wherefore art thou, Borneo? | molly
		Forgot to plug in my elbow last night and now my brain's at 6% | molly
		You vacuumed the lawn thrice daily and yet still, somehow, grubs | molly
		Smote by cornichons. Again. | molly
		They're ratcheted they storm, but succumbed to the stew. RIP | molly
		Single player checkers | tom
		Team based chess | tom
		Party sized solitaire | tom
		The theoretical implications of spaghetti are grave | molly
		Carbonation is simply the souls of aphids, captured and canned | molly
		Khaki is the crossroads between compromise and despair | molly
		Just an unacceptable amount of compost | henry
		Consumed by gumption | molly
		Here they are / Stay / stay / &stay& | henry
		Gender-neutral fellow | tom
		What are you waving | tom
		You're not alone (onionous) | tom
		I'm here, I'm queer, and I'm indented in the middle | henry
		Safety goggles are required to handle the creature | tom
		Do you need some rainbows as backups for today? | molly
		A penumbra of chit-chat hovered above his head | molly		
	`),
	// people, foolish things
	new Scroll("Fools", `
		That is normal | henry
		This is expected behavior | max
		Mackenzie: good gods, good humans, good stories, good people, good music | AI
		And Mackenzie said the terms arent negotiable, but we'd continue regardless | tom
		Mackenzie: last time, last runner, last life | tom
		Special characters, special people | henry
		Grim, the peddler, amongst the Lorician | tom
		Cephalopods are particularily bad spies | henry
		Trees don't just grow on money | molly
		I open my mouth and the continent surges through my esophagus | henry
		Purchasing continents on the dark web | henry
		I think Rowan is dead | sofia
		Rowan is the soup-reme being | sofia
		His name is clearly Brock | henry
		The length of the nasal cavity can be unexpected, and not for the faint of heart | henry
		We don't know because we crossed it substantially | henry
		Only worry about what &won't& happen | henry
		We'll have a splendid time. It'll be absolutely wonderful there. You won't have to worry about a singular thing | tom
		Free Chile from its Northern constraints | tom
		Canniness in this trying time | tom
		Dying of thirst is a substantial possibility on the way from legality to morality | henry
		Clicking noises aren't &neccessarily& a bad sign | tom
		Why are you alright? | tom
		Overdramatic, but in perfect time | tom
		Sufficiency, sweetheart | tom
		Tied up in holiday ribbons! | tom
		Many simply voted for a candidate they detest because they feared the other guy | tom 
		Discernibly indistinguishable | tom
		I bet I haven't the slightest clue | henry
		I don't think that &should& happen ever again | tom
		"If you feel lost, remember everyone else is too, in their own way..." / "I'm asking for directions you idiot!" | henry
		You dare to be bored in this house!? | henry
		I've cracked the Morse code | tom
		"&We& are all the best music," he said from his throne of lies | declan
		When there is silence, there is a lack of conversation | sofia
		I love myself / A good fjord | declan
		Talking about how great your ego is | tom
		Remove power from your device (without using it) | henry
		An academy of illustrious nincompoops | molly
		He has the genius not to say the extraordinary but to say the ordinary | anna
		A bunch of random words equals profound knowledge? I suppose | mayzie
		Gold doesn't tarnish! / Easy for you to say... | noah / camden
		He literally just killed his glasses | forrest
		Now &that's& how the job is done | tom
		I know acceptance when I see it | tom
		I know resignation when I see it | tom
		I know reflective, despite not having seen it | tom
		The miser and his mise | tom
		They are heading out to go stopping | henry
		What do you want me to say? "What are we aware of?"? | wes
		Encrypting your soul | tom
		There many things young children will wonder in their lifetimes, such as: "How long will the flame persist?" | tom
		The turrets are just a precaution | henry
		Taken* photographs of the mathematically proven "unreal" | tom
		The stranger is drawing everything you've seen | tom
		Always doubt the skeptics | alan
		Those who try and stop you have never seen the power of bees | declan
		We take nothing as a yes / We take everything as a no | hyacinth
		Wants vs. needs guys! Skin is &completely& optional | hyacinth
		They can ask &themselves& to do things | wes
		I haven't mentioned it | tom
	`),
	// shapes, geometry, form
	new Scroll("Meilothon", `
		Non-Euclidean geometry uses the romantic solids | henry
		Folding, folding, folding. When will it's form repeat? | henry
		Perfect squares are impossible in this realm / We believe it is due to the makeup of matter
		Biting the Gordian knot | tom
		Knotted up words | tom
		Half-hearted black holes | tom
		Unspinning particles / Unvibrating knots | tom
		You look very trapezoidal from this angle | henry
		...and the vessel was constructed to be longer than it was wide / the height would be changable if needed | tom
		The builders, although small, are always with you | tom
		This object contains several surfaces, most of which have vernacular potential! | henry
		Distance is a persistent construct | tom
		You are too big to live on a tiny island in any shape or form | tom
		Spaces between your fingers and noses | henry
		Heavy objects going for an excursion | henry
		Why do pencils &have& six sides? | wes
		All I'm saying is that makes overlap super complicated | henry
		Zooming by at possible speeds | tom
		You are scared of the space inside | henry
		The icosahedrons are &languishing& | tom
		The icosahedrons are #crestfallen# | tom
		Bottles #filled# with none of the states of matter | tom
		Butter prism in a glass | henry
		Elliptical is as elliptical does | molly
		Division into various sanctions | tom
		Volumetric, Voluimperial | henry
		Truly reprehensible geometry | henry
		New quarks! | tom
		Phase diagrams are purely situational. &pours you a cup of steaming liquid oxygen& | tom
		Unbounded force from a swining plumb bob | tom
		Three dimensions mapped into your mind | tom
		Make orbs round again | wesley
		Immensity is an unknown contruct | tom
		Strong gravity, weak gravity, and visible gravity | tom
		Circles dream of being edgy, but alas | molly
		Thinking outside the box, and inside the sphere | henry
		Merely a yard from your home | henry
		Once upon a space | tom
		The heavy vibration is indeed necessary | tom
		You'll know when you're not continguous | molly
		Estranged coordinate points in space | tom
		They've got some columns! | julian
		Sideways and vertical | tom
		Especially gradiented spoon | tom
		Knotting of the intestines | henry
		Periodic visits to the infinite will leave you gasping for purpose | henry
		Borders of my mind | tom
		Origami-shaped mind | tom
		Attacked from an obtuse angle | tom
		Our beings... a perfect circle | tom
		Highly relational data | henry
		Deep, bitter, and hateful three-dimensional forms | tom
		Cardioid shaped skull | tom
		The box has six sides people can see | anna
		Spherical life on a spherical world | tom
		Kaleidoscope, oh sweet swirling geometric mandala, stand still | anna
		Or... and hear me out... a triangle | tom
		Speed limits are for the third dimension | ryan
	`),
	// government, electronics (ock - la - swah)
	new Scroll("Oklacois", `
		Don't fear the establishment* | henry
		Just a switch on a circuitboard | tom
		Computers aren't electronic, but will become electronic one you know what you're looking for | tom
		She turns wiring to meal for the unconstitutionalists | henry / tom
		&holds up olive& Electrically sufficient | tom
		Evil SUV electric car | forrest
		Ghosts are kept apart from civilians in federal cemetaries | tom
		The blackberry bushes have come to an unanimous consensus | tom
		Two small, particular, oddly specific tasks | molly
		Radical centrism is a controversial stance | henry
		The office of establishment is heavy with betrayal | henry
		Physiocrats with save* our government | henry
		The new reign is disappointed in its citizens | tom
		Applications violating the basic barriers of technology / Worms floating in the air | henry
		The only thing that changes is the name, and the map above | julian
		From the floor on up | henry
		Edible technology is the ⁿᵉˣᵗ ˢᵗᵉᵖ | tom
		Cube-shaped flags | tom
		C.l.a.r.I.t.'.Y | tom
		Mandated cog turning initiative | tom
		The administration wants a population decrease | tom
		"A mallet for peace and a mallet for subduing the spectators" | tom
		The cameras are decoys. It is the walls that view you | tom
		Electrically bitter | hyacinth
		Cartridge based desire | tom
		Certified pipe-forgetter | tom
		SWIM AREA: there is no SWIM allowed in the ˢʷᶦᵐ area. P-p-pleeeease coalesce ᵉˡˢᵉʷʰᵉʳᵉ | tom
		Expressing yourself is a bad way to get the information | hyacinth
		Caps-locking your life and times | tom
		Cannibalistic machines causing slight networking issues | tom
		You've been put on Silence! | tom
		An active effort to be addressed | hyacinth
		An officer and a half | tom
		Selling the ocean just to pass a new motion | tom
		The taxis are &sliding smoothly& / They'll be here soon | hyacinth
		Truly exonerated on a shockingly rainy day | hyacinth
		We're adding to the document | hyacinth
		Liaising with the incandescence | molly
		I know their actions, not themselves | tom
	`),
	// definitions
	new Scroll("Dictatics", `
		Anagrams (&\\/ˈanəˌgrams\\/&): In order to get a deeper understanding of mathematics and to grasp the world of philosophy, here is a list of most important art | AI
		Moderation (&\\/ˌmädəˈrāSH(ə)n\\/&): an effective anti-productivity mechanism | henry
		Netches (&\\/nɛtʃz\\/&): A shallow corner, a human can only descend about six in a lifetime but others can do much more | tom
		Aplosery (&\\/æploʊsəri\\/&): Knowledge gained through metaphysical or spiritual extrasensory input | tom
		Aplosiatic (&\\/æploʊsiætɪk\\/&): One who is detached from reality | One who gains experience\\/input from extrasensory sources | tom
		Lelipatheim (&\\/lɛˈləˌpæθiɛm\\/&): The state of experiencing a large number of conflicting emotions at the same moment, typically in some balance | tom
		Ift's Day (&\\/ɪftˌs deɪ\\/&): The day when the sun created the Pillars | tom
		Kiplim (&\\/ˈkɪpˌlɪm\\/&): An easily snapping rope | tom
		Cytrusid (&\\/ˈsɪtˌrusɪd\\/&): A very small, light-green fruit found in the Spite Range. Inedible, but has other uses | tom
		Orthomine (&\\/ˈorθoʊmaɪn\\/&): any one of the narrow, vertical, pre-Illuminating tunnels within the pillars | tom
		Nau (&\\/naʊ\\/&): A medium sized, freshwater fish. Lives in alpine climates, such as the Apex | tom
		Cenosidian (&\\/ˈsiˌnoʊsədiɛn\\/&): One who cannot remember the past | One who lives within the Respite | tom
		Nepymil (&\\/nəpɪmɪl\\/&): The "soil" found in the Spite Range | tom
		Nipore (&\\/nəˈporeɪ\\/&): To be intentionally late | tom
		Aplurion (&\\/ˈæpləriɒn\\/&): An impossibly large watermass | tom
		Orvis (&\\/ˈorˌvɪs\\/&): A small to large plant with a thick-spined, spindly root structure and an orange-colored, thick, sticky trunk called 'the lily' that grows naturally within the Spite Range | AI
		Itzkahova (&\\/ɪtzkəhoʊvə\\/&): A deep, biodiverse crevasse | tom
		Counseling (&\\/ˈkouns(ə)liNG\\/&): Stop being sad in this hell of an experience | tom
		Retrulatery (&\\/rɛtrulɔtəri\\/&): decor, typically ceremonial or ritualistic | tom
		Sum (&\\/səm\\/&) [math]: To #sum#marize data | henry
		Oydiu (&\\/ɔɪdu\\/&): Regretting enjoyable actions as you do them, all while continuing | henry
		Compass (&\\/ˈkəmpəs\\/&): an effective tool for idiots | tom
		Compass (&\\/ˈkəmpəs\\/&): an ineffective tool for architects | henry
		Rachet Tool (&\\/ˈrætʃ ɪt ˈtül\\/&): a moderate tool for the intellectually inclined | tom
		Mevene (&\\/mɛ̃ˌvin\\/&): Slow, unnoticed, sneaky | tom
		Opaquify (&\\/oʊˈpɑkɪfaɪ\\/&): to make more convoluted and obscure | henry
		Yogurt (&\\/ˈjoʊgərt\\/&): the ultimate chicken or egg | molly
		Piffcor (\\/pɪfˌkor\\/): the smell of wet charcoal\\/ash | the smell of an old fire | tom
		Inspiration Rod (\\/ˌinspəˈrāSHən räd\\/): A long cylinder made of steel used to increase the chance of inspiration striking at a specific location | henry
		The lil' guy (\\/T͟Hə lɪl ɡī/\\): The specific and abstract of the Hund
	`),
	// zoest
	new Scroll("Umlauts", `
		Window pains: baguettes made of glass | henry / zoë
		The given is in the pudding | zoë
		Hee! hee! Geometry! | zoë
		Just that little existential something in my day | zoë
		The lil' guy's feeling snuggly | zoë
		Two points determine a lime | zoë
		"Mise en place"?! No! It's "I'm en place"! | zoë
		On a sinking ship, given the choice between a first class life and a &sweet& boat, you chose the former | zoë
		I'm braiding my bones | zoë
		Ah yes! Your two genres! Psychology and evaporated milk | zoë
		Do you want me to &recind& my offer | zoë
		I got condensed | zoë
		Why don't &you& know what your lungs taste like? (accusatory) | zoë
		Hiiiiii! How beest thou? | zoë
		I think I'm funny / It seems I'm very alone in that thought | zoë
		I will be the rice I want to see in the world | zoë
		I get my hair done at the blacksmith's | zoë
		Black market orthodontia | zoë
		We've been hired to party and we don't care | zoë
		What about ice hazards | zoë
		That was now and this is then | zoë
		Crash bang moo! The cows have dispersed | zoë
		Too many cooks spoil the soup / You only need one for proper flavoring | zoë
		My get up and go got up and sat back down | zoë
		Ears are like dogs, they hear things and they bark a lot | zoë
	`)
];

// compute weights
const allProverbs = scrolls
	.flatMap(scroll => scroll.proverbs)
	.filter(scroll => scroll.authors.length > 1 || scroll.authors[0] !== "unknown");

const allScrolls = scrolls
	.map(scroll => scroll.title);

const totalProverbs = scrolls
	.map(scroll => scroll.size)
	.reduce((a, b) => a + b, 0);
for (let i = 0; i < scrolls.length; i++)
	scrolls[i].computeWeight(totalProverbs);

const allProverbWords = allProverbs
	.map(proverb => proverb.text
		.split(/\b/g)
		.filter(piece => piece.match(/\w/g))
	);
const allWords = allProverbWords.flat();
const allWordLengths = allWords.map(word => word.length);
const allProverbWordLengths = allProverbWords.map(words => words.length);
const allProverbLetters = allProverbWords
	.map(words => words
		.flatMap(word => word
			.toLowerCase()
			.split("")
		)
	);
const allLetters = allProverbLetters.flat();
const allAuthors = [...new Set(allProverbs.flatMap(proverb => proverb.authors))];

function authorsOf(fragment) {
	const contains = allProverbs.filter(proverb => proverb.text.toLowerCase().indexOf(fragment.toLowerCase()) > -1);
	if (contains.length === 1) return contains[0].authors;
	const matches = allProverbs.find(proverb => proverb.text === fragment);
	return matches ? matches.authors : null;
}

function amountAuthoredBy(author) {
	return allProverbs.filter(proverb => proverb.authors.includes(author)).length;
}

function percentAuthoredBy(author) {
	return amountAuthoredBy(author) / totalProverbs * 100;
}

function percentToProverbs(author, percent) {
	const amount = amountAuthoredBy(author);
	percent /= 100;
	const currentPercent = amount / totalProverbs
	const finalPercent = percent + currentPercent;
	return (amount / finalPercent - totalProverbs) / (1 - 1 / finalPercent);
}

function proverbsToPercent(author, proverbs) {
	const amount = amountAuthoredBy(author);
	const finalProverbs = amount + proverbs;
	const finalTotal = totalProverbs + proverbs;
	const percent = finalProverbs / finalTotal - amount / totalProverbs;
	return percent * 100;
}

function proverbsBy(author) {
	return allProverbs
		.filter(proverb => proverb.authors.includes(author))
		.map(proverb => proverb.text);
}

function howMuchToWorry() {
	return scrolls.find(scroll => scroll.title === "Freud the Spinner").length / totalProverbs;
}