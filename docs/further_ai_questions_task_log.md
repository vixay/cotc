# not yet given tasks 
2025-08-25
 - allow users to share urls with current view and filters and state. 
 - I am going to sleep , you work on the remaining tasks autonomously

## images

download the imgs from https://github.com/octopath-tier-list-maker/octopath-tier-list-maker.github.io/tree/master/img/octopath/cotc and add to sources and credits as well for the images.  rename the images according to the character name so that we can reference it accurately.
alt source https://octopathtraveler.fandom.com/wiki/Champions

--
## accessories

--
## guide promotion and feedback

used my tool today
partito -> u10 first
gilderoy - > shard
Theo -> Shard
molrusso -> A4
kouren -> shard
	

create a reddit post announcing the launch of the new site and it's updates. 
show i used it successfully for the characters mentioned above. 

mention how it took a lot of effort to get here. 
caveats about skill database and tags not being complete yet
ask for help if someone can contribute

keep it concise and friendly

/fix verify bank account and payment first. 

--

 see the screenshot, i see wierd characters when seeing the changelog.md in the browser, (it's emojis i believe), is there a way to show them in the browser? 

## deployment


---

continue with tagging.
some duplication issues in tagging, we can see that some tags are for a4priority and ultpriority and roles ..etc. what's your recommendation for fixing these dupes? I would think we could infer the roles, and a4p and ultp from the tags by converting the data to tags in specific format. refer to our tag library/planning, we could then have a flexible data structure and flexible approach to presenting information as well. we should remove some tags though that are redundant with the data that we have? maybe that's the simpler approach. remove tags for starrating as we already have that separately, remove a4 and ult, check if we alread have data for that character before removing it, if we don't migrate it then remove those tags. any role tags, migrate it to the roles as well, though i still like my idea of role:buffer kind of tags. please suggest. we also see tags for the class, like warrior ...etc. 

--
also there's a lot of information in the markdown files which shows up in the modal, which we can use to create the right tags for each skill, and their accessories. We should aim to update the characters database to be as complete as possible so that we have a source of structured data for all the skills and information for future loadouts, optimizations and calculations. I want you to design a method to extract and convert this information accurately into our database, and synthesize information about the character, especially tags for skills using our tagging conventions, tagging for accessories and proper full descriptions for each skill/passive/accesory/ultimate in the database. so devise a strategy and let me know how confident you are of generating acccurate info. Also generate roles:AI:{buff?,debuff?...etc} tags so that we can distinguish between human generated and AI generated info. we need to remove all unknown roles as well

## AI


## GOAL FOR DATABASE
 - I want all the skills/accessories description in the the character database such that I don't need the markdown files anymore at all, and can generate the same output as the markdown without depending on it. and given that the tags are automatically extracted they can be a separate database but linked to the main character database, so that we can manipulate the tags them until i am satisfied with it's organization. 
 After the tags are successfully implemented the goal of searching for effects shuold be implemented correctly. 


 Goals for accessories/skills
 - If you recall one of my goals was to search for specific effects via the tags, and we shuold be able to select from the different types of skills and accessories, so the skill search and accessories search should be a single page, with the primary search being through tags. 
 e.g. I should be able to search for provoke effect, and be able to choose, skills (passive, active, ultimate, ex), or accessories or a combination of them.
 Thus if want to maximize my E.Atk damage at start i would look for trigger at start of battle, edef down, and eres down and eatk up, for accessories and skills. 

 ## Skills problem
  I see in your skills extraction that there are some issues for the Blessing of the Lantern Skills (BotL) be it passive or active. If the BotL passive doesn't have a name , you are putting only '(' as the skill name e.g. 9s, you should default to Blessing of the Lantern Skills Passive (BotL_passive) for that skill if you can't find a name. you can identify the BotL skills by the url ([✦](https://www.notion.so/Blessing-of-the-Lantern-08a0c77714a940fa8ce8712b1582502d?pvs=21)) and you should probably replace the url in the markdown as well and use the ✦ symbol for the skill. 

  so there are now multiple skill types, passive (or support), active (or battle), ultimate, ex,  and blessing of the lantern skills 1 of each passive and active in the corresponding section. You can refer to the markdown for the organization of these skills. 

for the tags, i think you are adding too many tags, we need to ensure we don't have duplicate tags, i saw that we have multiple special_bp_regen, bp_generation_boost, special_bp_generation_boost ..etc and the distinction between them isn't clear, please have hover tooltips for the tags explaining what it does and avoid duplicates. 
-- 

we should update the database to fix the issues, rathe than having code to handle the edge cases, we should try to ensure we have good data in the database. 

given that the characters database is becoming large and unwieldy for comparisons, maybe we should split out all the skills information to a separate database to make it easier to manage and compare. What do you think? 

## refactor
also maybe we should consider refactoring our app to use classes for character, accessories, with a unified interface for that apps, that deal with all the loading of the data nad parsing and tagging. as managing the database manually is becoming a pain. 

we can define the interface mutually for the class, then define some test cases, and then run the extraction again. 


## architecture

