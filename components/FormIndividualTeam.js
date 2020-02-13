//This Will need to take in a click event that triggers a function NewProject that changes the state to update it with new Team Members.

const FormIndividualTeam = props => {
  return (
    <div className='row mt-5'>
      <div className='col-md-12 mx-auto'>
        <h2>{props.name} Collaborators</h2>
        <div className='row'>
          <div className='col-md-8'>
            <form>
              <label htmlFor='Collaborator'>Name of Collaborator:</label>
              <input
                type='text'
                name='Collaborator'
                className='form-control'
                id='Collaborator'
                placeholder='Collaborator'
              />
              <br />
              <button>Add Collaborator {props.name}</button>
              <br />
              <button>Continue on To Next Team</button>
            </form>
          </div>
          <div className='col-md-4'>
            <p>
              This is where Team Member names will show up as you type them in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormIndividualTeam;