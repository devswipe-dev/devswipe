import React, { ChangeEvent, FormEvent, useState } from "react";
import "./Projects.css";
import Tabs from "./components/Tabs";
import { AttributesInput } from "./components/AttributesInput";
import { apiCall, Project, User } from "./util/constants";

interface ProjectsProps {
  chatNotifications: number;
  projects: Project[];
  user: User | null;
  userMap: Map<string, User>
}

const ProjectsPage: React.FC<ProjectsProps> = ({ chatNotifications, projects, user, userMap }: ProjectsProps) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null); //update and edit 
  const [oldAttributesList, setOldAttributesList] = useState<string[]>([]);
  const [attributesList, setAttributesList] = useState<string[]>([]); 
  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [openRequests, setOpenRequests] = useState<string | null>(null); // Stores the ID of the project with open requests

  //create project
  const handleCreateBlankProject = async () => {
    try {
      const response = await apiCall.post(`/projects/add`, {});
      if (response.status === 200) {
        console.log("Blank project created successfully!");
      }
    } catch (error) {
      console.error("Project was not successfully added");
    }
  };

  const openUpdateProject = (project: Project) => {
    setCurrentProject(project);
    setOldAttributesList(project.attributes);
    setDescription(project.description);
    setProjectName(project.name);
    const scrollToElement = document.getElementById("project-header");
    if (scrollToElement) {
      scrollToElement.scrollIntoView();
    }
  }

  //delete stuff, needs to be changed probably lmk 
  const handleDeleteProject = async (e: FormEvent, id: string) => {
    e.preventDefault();
    const button = e.currentTarget;
    if (button.textContent === 'Delete') {
      button.setAttribute('disabled', 'true');
      for (let i = 3; i > 0; --i) {
        button.textContent = `Confirm: (${i})`;
        await new Promise((res) => setTimeout(res, 500));
      }
      button.textContent = `Confirm`;
      button.removeAttribute('disabled');
      return;
    }
    try {
      const response = await apiCall.post(`/projects/delete/${id}`);
      if(response.status === 200) {
        console.log("Project deleted successfully");
      }
    } catch (error) {
      console.error("Project was not successfully deleted");
    }
  };

  const handleAcceptOrReject = async(userId: string, projectId: string, type: 'ACCEPT' | 'REJECT') => {
    try {
      const body = {
        projectId: projectId,
        collaborator: userId,
      };
      if (type === 'ACCEPT') {
        const response = await apiCall.post(`/projects/acceptUser`, body);
        if (response.status === 200) {
          alert("Accepted user successfully!");
        }
      } else if (type === 'REJECT') {
        const response = await apiCall.post(`/projects/rejectUser`, body);
        if (response.status === 200) {
          alert("Rejected user successfully!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  //update for project code 
  const handleUpdateProject = async () => {
    try {

      if (!projectName || !description ) {
        alert("Please fill in all the required fields");
        return;
      }

      if (currentProject) {
        const response = await apiCall.post("/projects/update", {
          id: currentProject._id,
          name: projectName,
          description: description,
        });

        for (const attribute of attributesList) {
          if (!currentProject.attributes.includes(attribute)) {
            await apiCall.post("/projects/attribute/add", { attribute: attribute, id: currentProject._id });
          }
        }
  
        for (const attribute of currentProject.attributes) {
          if (!attributesList.includes(attribute)) {
            await apiCall.post("/projects/attribute/delete", { attribute: attribute, id: currentProject._id });
          }
        }

        
        if(response.status === 200) {
          alert("Project updated successfully!");
          setCurrentProject(null);
        }
      }

    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };  

  const handleProjectName = (e: ChangeEvent<HTMLInputElement>) =>
    setProjectName(e.target.value);
  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);

  // Toggle requests dropdown
  const toggleRequestsDropdown = (projectId: string) => {
    setOpenRequests((prev) => (prev === projectId ? null : projectId));
  };

  return (
    <div className="projects-page">
      {/* Tabs */}
      <Tabs currentTab="projects" chatNotifications={chatNotifications} />

      <div className="projects-container">
        <h1 id="project-header">Projects</h1>

        {/* Create Blank Project Button */}
        <button className="create-btn top-btn" onClick={handleCreateBlankProject}>
          Create Blank Project
        </button>

        {/* Update/Create Project Form */}
        {currentProject && (
          <div className="section">
            <h2>Update Project</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="project-name">Name</label>
                <input
                  id="project-name"
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={handleProjectName}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                placeholder="Project Description"
                value={description}
                onChange={handleDescription}
              />
            </div>

            <div className="section">
              <h3>Attributes</h3>
              <AttributesInput
                oldAttributesList={oldAttributesList}
                setAttributesList={setAttributesList}
                limit={7}
                placeholder="Search and select attributes"
              />
            </div>

            <button className="update-btn" onClick={handleUpdateProject}>
              Update Project
            </button>
          </div>
        )}

        {/* Display Projects */}
        <div className="projects-list">
          {projects.map((project) => (
            (!user || project.createdBy !== user._id) ? <div key={project._id}></div> :
            <div key={project._id} className="project-card">
              <h3>{project.name || "Untitled Project"}</h3>
              <p>{project.description || "No Description"}</p>
              <div className="attributes">
                {project.attributes.length > 0 ? (
                  project.attributes.map((attr, index) => (
                    <span key={index} className="attribute-tag">
                      {attr}
                    </span>
                  ))
                ) : (
                  <p>No Attributes</p>
                )}
              </div>
              <div className="project-actions">
                <button
                  className="update-btn"
                  onClick={() => openUpdateProject(project)}
                >
                  Update
                </button>
                {/*project.swipeRight.length*/ new Set(project.swipeRight).size !== (new Set(project.acceptedUsers).size+new Set(project.rejectedUsers).size)  && <button
                  className="requests-btn"
                  onClick={() => toggleRequestsDropdown(project._id)}
                >
                  Requests
                </button>}
                <button
                  className="delete-btn"
                  onClick={(e: FormEvent) => handleDeleteProject(e, project._id)}
                >
                  Delete
                </button>
              </div>

              {/* Requests Dropdown */}
              {openRequests === project._id && (
                <div className="requests-dropdown">
                  {
                    projects.find(val => val._id === openRequests) && projects.find(val => val._id === openRequests)!.swipeRight &&
                    projects.find(val => val._id === openRequests)!.swipeRight.map(userId => 
                      !userMap.get(userId) && ![...projects.find(val => val._id === openRequests)!.acceptedUsers, ...projects.find(val => val._id === openRequests)!.rejectedUsers].includes(userId) ? <div key={userId}></div> : 
                      <div key={userId} className="request-item">
                        <div>
                          <div>
                            <p>
                              @{userMap.get(userId)!.username}
                            </p>
                            <p>
                            {userMap.get(userId)!.bio}
                            </p>
                            <div className="attributes">
                              {userMap.get(userId)!.attributes.length > 0 ? (
                                userMap.get(userId)!.attributes.map((attr, index) => (
                                  <span key={index} className="attribute-tag">
                                    {attr}
                                  </span>
                                ))
                              ) : (
                                <p>No Attributes</p>
                              )}
                            </div>
                          </div>
                          <div className="accept-reject-container">
                            <button className="accept-btn" onClick={() => handleAcceptOrReject(userId, openRequests, 'ACCEPT')}>✅</button>
                            <button className="reject-btn" onClick={() => handleAcceptOrReject(userId, openRequests, 'REJECT')}>❌</button>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  <></>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
